import ERRORS from './error';

class PreconditionRequiredError extends Error {
    status: number;

    constructor(message: string = ERRORS.PRECONDITION_REQUIRED_ERROR.message) {
        super(message);
        this.name = ERRORS.PRECONDITION_REQUIRED_ERROR.name;
        this.status = ERRORS.PRECONDITION_REQUIRED_ERROR.status;
    }
}

export default PreconditionRequiredError;
