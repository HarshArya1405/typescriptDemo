import ERRORS from './errors';

class NoRecordFoundError extends Error {
    status: number;
    constructor(message = ERRORS.NO_RECORD_FOUND_ERROR.message) {
        super(message);
        this.name = ERRORS.NO_RECORD_FOUND_ERROR.name;
        this.status = ERRORS.NO_RECORD_FOUND_ERROR.status;
    }
}

export default NoRecordFoundError;
