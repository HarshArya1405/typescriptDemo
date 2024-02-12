import ERRORS from './error';

class BadRequestParameterError extends Error {
    status: number;

    constructor(message: string = ERRORS.BAD_REQUEST_PARAMETER_ERROR.message) {
        super(message);
        this.name = ERRORS.BAD_REQUEST_PARAMETER_ERROR.name;
        this.status = ERRORS.BAD_REQUEST_PARAMETER_ERROR.status;
    }
}

export default BadRequestParameterError;