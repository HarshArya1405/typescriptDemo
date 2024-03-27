import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { User } from '../../models';
import logger from '../../../util/logger';

// Define the type for request headers
interface RequestHeaders {
  authorization?: string;
}

// Define the type for request parameters
interface RequestParams {
  id?: string;
  userId?: string;
}

interface Request {
  method: 'POST' | 'PUT' | 'DELETE'; // Define HTTP method types
  params: RequestParams;
  user?: Partial<User>;
}

// Define the type for response methods
interface ResponseMethods {
  status(code: number): ResponseMethods;
  json(data: object): ResponseMethods;
}

const unauthenticatedResponse: object = {
  status: 401,
  name: 'UNAUTHENTICATED_ERROR',
  message: 'Unauthenticated'
};

// Middleware for handling authentication
@Middleware({ type: 'before' })
export class RoleBasedAuthentication implements ExpressErrorMiddlewareInterface {
  role: string; // Role name property

  constructor(role: string) {
    this.role = role;
  }

  async use(request: Request, response: ResponseMethods, next: () => void): Promise<void> {

    // Extract user ID from the request
    const userId = request.user?.id;

    if (userId) {
      try {
        // Fetch user from the database based on user ID along with roles
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { id: userId },
          relations: ['roles']
        }); // Load user along with roles

        if (user) {
          // Check if the user has the required role
          const hasRole = user.roles.some(role => role.name === this.role);
          if (!hasRole) {
            response.status(403).json({ message: 'Forbidden' }); // User doesn't have the required role
            return; // Return to avoid calling next() if there's an error
          }
          // Log user's roles
          if (user.roles && user.roles.length > 0) {
            const roles = user.roles.map(role => role.name).join(', ');
            logger.info(`User's roles: ${roles}`);
          } else {
            logger.info('User has no roles assigned.');
          }
        } else {
          logger.error('User not found');
        }
      } catch (error) {
        logger.error('Error fetching user:', error);
      }
    } else {
      logger.error('User ID not provided in the request');
    }

    next();
  }

  // Error handling middleware
  error(error: Error, request: { headers: RequestHeaders; user?: Partial<User> }, response: ResponseMethods): void {
    // Send Unauthorized response for any errors
    response.status(401).json(unauthenticatedResponse);
  }

  // Function to make the class callable
  static invoke(role: string): (request: Request, response: ResponseMethods, next: () => void) => Promise<void> {
    const instance = new RoleBasedAuthentication(role);
    return instance.use.bind(instance);
  }
}
