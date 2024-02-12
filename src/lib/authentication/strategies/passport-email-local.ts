// import passportLocal from 'passport-local';
// import { User }  from '../../../models';
// import { Op } from 'sequelize';

// const LocalStrategy = passportLocal.Strategy;

// const passportEmailLocalStrategy = new LocalStrategy(async (email: string, password: string, done: any) => {
//     try {
//         const user = await User.findOne({
//             where: {
//                 email: {
//                     [Op.iLike]: email
//                 }
//             }
//         });

//         if (!user) {
//             return done(null, false);
//         }

//         const isPasswordValid = await user.authenticate(password);

//         if (!isPasswordValid) {
//             return done(null, false);
//         }
//         return done(null, user);
//     } catch (err) {
//         return done(err, false);
//     }
// });

// export default passportEmailLocalStrategy;
