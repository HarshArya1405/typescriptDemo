import { HttpError } from 'routing-controllers';
import ERRORS from './errors';

class PreconditionRequiredError extends HttpError {
    public operationName: string;
  
    constructor(operationName?: string) {
      super(ERRORS.PRECONDITION_REQUIRED_ERROR.status);
      Object.setPrototypeOf(this, PreconditionRequiredError.prototype);
      this.operationName = operationName ?? ERRORS.PRECONDITION_REQUIRED_ERROR.message;
    }
  
    toJSON() {
      return {
        name:ERRORS.PRECONDITION_REQUIRED_ERROR.name,
        status: this.httpCode,
        message: this.operationName,
      };
    }
}
export default PreconditionRequiredError;

