import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { transformErrors } from '../../utils/common.js';
import ValidationError from '../errors/validation-error.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: "${req.path}"`, transformErrors(errors));
    }

    next();
  }
}
