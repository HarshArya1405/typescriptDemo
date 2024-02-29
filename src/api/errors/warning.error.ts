import { HttpError } from 'routing-controllers';
import ERRORS from './errors';

class WarningError extends HttpError {
    public operationName: string;
  
    constructor(operationName?: string) {
      super(ERRORS.WARNING_ERROR.status);
      Object.setPrototypeOf(this, WarningError.prototype);
      this.operationName = operationName ?? ERRORS.WARNING_ERROR.message;
    }
  
    toJSON() {
      return {
        name:ERRORS.WARNING_ERROR.name,
        status: this.httpCode,
        message: this.operationName,
      };
    }
}
export default WarningError;

