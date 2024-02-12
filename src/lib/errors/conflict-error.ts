import ERRORS from './error';

class ConflictError extends Error {
    status: number;

    constructor(message: string = ERRORS.CONFLICT_ERROR.message) {
        super(message);
        this.name = ERRORS.CONFLICT_ERROR.name;
        this.status = ERRORS.CONFLICT_ERROR.status;
    }
}

export default ConflictError;
