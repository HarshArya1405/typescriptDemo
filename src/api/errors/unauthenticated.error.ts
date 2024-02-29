import { HttpError } from 'routing-controllers';
import ERRORS from './errors';

class UnauthenticatedError extends HttpError {
    public operationName: string;
  
    constructor(operationName?: string) {
      super(ERRORS.UNAUTHENTICATED_ERROR.status);
      Object.setPrototypeOf(this, UnauthenticatedError.prototype);
      this.operationName = operationName ?? ERRORS.UNAUTHENTICATED_ERROR.message;
    }
  
    toJSON() {
      return {
        name:ERRORS.UNAUTHENTICATED_ERROR.name,
        status: this.httpCode,
        message: this.operationName,
      };
    }
}
export default UnauthenticatedError;

