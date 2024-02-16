import ERRORS from './errors';

class BadRequestParameterError extends Error {
    status: number;
    constructor(message = ERRORS.BAD_REQUEST_PARAMETER_ERROR.message) {
        super(message);
        this.status = ERRORS.BAD_REQUEST_PARAMETER_ERROR.status;
        this.name = ERRORS.BAD_REQUEST_PARAMETER_ERROR.name;
    }
}

export default BadRequestParameterError;
