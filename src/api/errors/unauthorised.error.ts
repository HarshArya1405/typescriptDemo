import { HttpError } from 'routing-controllers';
import ERRORS from './errors';

class UnauthorisedError extends HttpError {
    public operationName: string;
  
    constructor(operationName?: string) {
      super(ERRORS.UNAUTHORISED_ERROR.status);
      Object.setPrototypeOf(this, UnauthorisedError.prototype);
      this.operationName = operationName ?? ERRORS.UNAUTHORISED_ERROR.message;
    }
  
    toJSON() {
      return {
        name:ERRORS.UNAUTHORISED_ERROR.name,
        status: this.httpCode,
        message: this.operationName,
      };
    }
}
export default UnauthorisedError;

