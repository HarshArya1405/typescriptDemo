import { Request, Response } from 'express';
import AuthenticationService from '../services/authentication.service';
import userService from '../services/user.service';
import { BadRequestParameterError } from '../lib/errors';
import MESSAGES from '../util/messages';

interface CustomError extends Error {
    status?: number;
}

class AuthenticationController {
    async loginWithEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new BadRequestParameterError(MESSAGES.EMAIL_OR_PASSWORD_REQUIRED);
            }

            const { user, token } = await AuthenticationService.loginWithEmail({ email, password });

            res.status(200).json({ user, token });
        } catch (err) {
            const error = err as CustomError;
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async signUp(req: Request, res: Response): Promise<void> {
        try {
          // Destructure the request body to extract user data
          const { firstName, middleName, lastName, email, password, mobile, gender } = req.body;

          // Call the createUser method from the userService to create a new user
          const user = await userService.createUser({ firstName, middleName, lastName, email, password, mobile, gender });
    
          // Send a success response with the created user object
          res.status(201).json({ user });
        } catch (error) {
          // Handle any errors and send an error response
          console.error('Error during user registration:', error);
          res.status(500).json({ error: 'Failed to register user.' });
        }
      }
    }

export default new AuthenticationController();
