// import User from '../models/user.model';
// import { UnauthenticatedError, NoRecordFoundError } from '../lib/errors';
// import MESSAGES from '../util/messages';
// import { JsonWebToken, Token } from '../lib/authentication/index';

// class AuthenticationService {
//     async loginWithEmail(params: { email: string; password: string }): Promise<{ user: any; token: string }> {
//             const { email, password } = params;
//             const user = await User.findOne({
//                 where: { email },
//             });

//             if (!user) {
//                 throw new UnauthenticatedError(MESSAGES.INVALID_EMAIL_ADDRESS);
//             }
//             const isPasswordValid = await user.authenticate(password);
//             if (!isPasswordValid) {
//                 throw new UnauthenticatedError(MESSAGES.INVALID_PASSWORD);
//             }

//             // If email and password are correct, create and return access token
//             const tokenRes = await this.createAccessToken(user.id!);
//             return tokenRes;
//     }

//     async createAccessToken(userId: number): Promise<{ user: any; token: string }> {
//             let user = await User.findOne({
//                 where: { id: userId },
//             });

//             if(!user){
//                 throw new NoRecordFoundError(MESSAGES.USER_NOT_FOUND);
//             }

//             user = user.toJSON() as User;

//             const tokenPayload = {
//                 user,
//             };

//             const tokenExpirySec = parseInt(process.env.JWT_TOKEN_EXPIRY_IN_SEC ?? '3600', 10);
//             const token = new Token(tokenPayload, tokenExpirySec);
//             const jwtSecret = process.env.JWT_TOKEN_SECRET || 'defaultSecret';
//             const jwt = new JsonWebToken(jwtSecret);
//             const signedToken = await jwt.sign({ payload: tokenPayload, exp: token.exp });

//             return { user, token: signedToken };
//     }
// }

// export default new AuthenticationService();
