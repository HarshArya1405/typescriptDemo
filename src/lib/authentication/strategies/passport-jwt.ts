// import passportJWT, { StrategyOptionsWithoutRequest, JwtFromRequestFunction } from 'passport-jwt';
// import { Request } from 'express';
// import { IncomingHttpHeaders } from 'http';
// import { User } from '../../../models';
// import { UnauthenticatedError } from '../../errors';
// import MESSAGES from '../../../util/messages';

// const JwtStrategy = passportJWT.Strategy;

// const jwtExtractor: JwtFromRequestFunction<Request> = function (req) {
//     let token: string | null = null;
//     const headers = req.headers as IncomingHttpHeaders;
//     if (headers && headers.authorization) {
//         const parts = headers.authorization.split(' ');
//         if (parts.length === 2 && parts[0] === 'Bearer') {
//             token = parts[1];
//         }
//     }
//     return token;
// };

// const opts: StrategyOptionsWithoutRequest = {
//     jwtFromRequest: jwtExtractor,
//     secretOrKey: 'mykey',
// };

// const passportJwtStrategy = new JwtStrategy(opts, async (jwtPayload: { user: { id: string } }, done: (error: any, user?: any) => void) => {
//     try {
//         const user = await User.findOne({
//             where: {
//                 id: jwtPayload.user.id
//             }
//         });

//         if (!user) {
//             return done(new UnauthenticatedError(MESSAGES.LOGIN_ERROR_USER_ACCESS_TOKEN_INVALID), null);
//         }

//         return done(null, user.toJSON());
//     } catch (err) {
//         return done(err, null);
//     }
// });

// export default passportJwtStrategy;
