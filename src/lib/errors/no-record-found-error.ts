import ERRORS from './error';

class NoRecordFoundError extends Error {
    status: number;

    constructor(message: string = ERRORS.NO_RECORD_FOUND_ERROR.message) {
        super(message);
        this.name = ERRORS.NO_RECORD_FOUND_ERROR.name;
        this.status = ERRORS.NO_RECORD_FOUND_ERROR.status;
    }
}

export default NoRecordFoundError;
