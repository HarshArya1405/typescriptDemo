import ERRORS from './errors';
import { HttpError } from 'routing-controllers';

class BadRequestParameterError extends HttpError {
    public operationName: string;
  
    constructor(operationName?: string) {
      super(ERRORS.BAD_REQUEST_PARAMETER_ERROR.status);
      Object.setPrototypeOf(this, BadRequestParameterError.prototype);
      this.operationName = operationName ?? ERRORS.BAD_REQUEST_PARAMETER_ERROR.message;
    }
  
    toJSON() {
      return {
        name:ERRORS.BAD_REQUEST_PARAMETER_ERROR.name,
        status: this.httpCode,
        message: this.operationName,
      };
    }
}
export default BadRequestParameterError;

