import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import mime from 'mime-types';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { nanoid } from 'nanoid';
import { checkImage } from '../../utils/common.js';
import { UserValidationEnum } from '../../types/validation.enum.js';
import ValidationError from '../errors/validation-error.js';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        let error: null | Error = null;

        if (!checkImage(file.originalname)) {
          error = new ValidationError(
            UserValidationEnum.AvatarPath.Matches.Message,
            [{
              property: 'avatarPath',
              value: file.originalname,
              messages: [UserValidationEnum.AvatarPath.Matches.Message]
            }]
          );
        }

        callback(error, `${filename}.${extension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({storage})
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
