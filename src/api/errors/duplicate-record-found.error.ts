import { HttpError } from 'routing-controllers';
import ERRORS from './errors';

class DuplicateRecordFoundError extends HttpError {
    public operationName: string;
  
    constructor(operationName?: string) {
      super(ERRORS.DUPLICATE_RECORD_FOUND_ERROR.status);
      Object.setPrototypeOf(this, DuplicateRecordFoundError.prototype);
      this.operationName = operationName ?? ERRORS.DUPLICATE_RECORD_FOUND_ERROR.message;
    }
  
    toJSON() {
      return {
        name:ERRORS.DUPLICATE_RECORD_FOUND_ERROR.name,
        status: this.httpCode,
        message: this.operationName,
      };
    }
}
export default DuplicateRecordFoundError;

