import express, { Router } from 'express';
import passport from 'passport';
import passportEmailLocalStrategy from '../lib/authentication/strategies/passport-email-local';
import authenticationController from '../controllers/authentication.controller';

const authenticationRouter: Router = express.Router();

// Use passport email local strategy
passport.use(passportEmailLocalStrategy);

// Route for login with email and password using passport email local strategy
authenticationRouter.post('/login', authenticationController.loginWithEmail);
authenticationRouter.post('/register', authenticationController.signUp);

export default authenticationRouter;