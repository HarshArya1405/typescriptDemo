// import jwt, { SignOptions } from 'jsonwebtoken';

// interface TokenPayload {
//     [key: string]: any;
// }

// class JsonWebToken {
//     private secret: string;
//     private options: SignOptions;

//     constructor(secret: string, options?: SignOptions) {
//         this.secret = secret;
//         this.options = options || {};
//     }

//     sign(token: { payload: TokenPayload; exp: number }): Promise<string> {
//         const mergedOptions: SignOptions = {
//             ...this.options,
//             expiresIn: token.exp
//         };

//         return new Promise((resolve, reject) => {
//             jwt.sign(token.payload, this.secret, mergedOptions, (err, token) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(token as string);
//                 }
//             });
//         });
//     }

//     verify(jwtToken: string): Promise<TokenPayload> {
//         return new Promise((resolve, reject) => {
//             jwt.verify(jwtToken, this.secret, (err, decoded) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(decoded as TokenPayload);
//                 }
//             });
//         });
//     }
// }

// export default JsonWebToken;
