import { HttpError } from 'routing-controllers';
import ERRORS from './errors';

class NoRecordFoundError extends HttpError {
    public operationName: string;  
    constructor(operationName?: string) {
      super(ERRORS.NO_RECORD_FOUND_ERROR.status);
      Object.setPrototypeOf(this, NoRecordFoundError.prototype);
      this.operationName = operationName ?? ERRORS.NO_RECORD_FOUND_ERROR.message;
    }
  
    toJSON() {
      return {
        name:ERRORS.NO_RECORD_FOUND_ERROR.name,
        status: this.httpCode,
        message: this.operationName,
      };
    }
}

export default NoRecordFoundError;
