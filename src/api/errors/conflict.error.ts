import ERRORS from './errors';
import { HttpError } from 'routing-controllers';

class ConflictError extends HttpError {
    public operationName: string;
  
    constructor(operationName?: string) {
      super(ERRORS.CONFLICT_ERROR.status);
      Object.setPrototypeOf(this, ConflictError.prototype);
      this.operationName = operationName ?? ERRORS.CONFLICT_ERROR.message;
    }
  
    toJSON() {
      return {
        name:ERRORS.CONFLICT_ERROR.name,
        status: this.httpCode,
        message: this.operationName,
      };
    }
}
export default ConflictError;

