import passportEmailLocalStrategy from './strategies/passport-email-local';
import passportJwtStrategy from './strategies/passport-jwt';
import Token from './token';
import JsonWebToken from './json-web-token';

exports.JsonWebToken = JsonWebToken;
exports.Token = Token;
exports.passportEmailLocalStrategy = passportEmailLocalStrategy;
exports.passportJwtStrategy = passportJwtStrategy;

export { JsonWebToken, Token };
