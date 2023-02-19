import { StatusCodes } from 'http-status-codes';
import { ValidationErrorFieldType } from '../../types/validation-error-field.type.js';

export default class ValidationError extends Error {
  public httpStatusCode!: number;
  public details: ValidationErrorFieldType[] = [];

  constructor(message: string, errors: ValidationErrorFieldType[]) {
    super(message);

    this.httpStatusCode = StatusCodes.BAD_REQUEST;
    this.message = message;
    this.details = errors;
  }
}
