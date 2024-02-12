import ERRORS from './error';

class DuplicateRecordFoundError extends Error {
    status: number;

    constructor(message: string = ERRORS.DUPLICATE_RECORD_FOUND_ERROR.message) {
        super(message);
        this.name = ERRORS.DUPLICATE_RECORD_FOUND_ERROR.name;
        this.status = ERRORS.DUPLICATE_RECORD_FOUND_ERROR.status;
    }
}

export default DuplicateRecordFoundError;
