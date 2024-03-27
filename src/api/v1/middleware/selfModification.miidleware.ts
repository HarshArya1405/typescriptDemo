import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { User } from '../../models';

// Define the type for request headers
interface RequestHeaders {
  authorization?: string;
}

// Define the type for request parameters
interface RequestParams {
  id?: string;
  userId?: string;
}

// Define the type for request
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

// Define unauthenticated response
const unauthenticatedResponse: object = {
  status: 401,
  name: 'UNAUTHENTICATED_ERROR',
  message: 'Unauthenticated'
};

// Middleware for handling authorization for self-modification
@Middleware({ type: 'before' })
export class SelfModificationAuthorizationMiddleware implements ExpressErrorMiddlewareInterface {
  async use(request: Request, response: ResponseMethods, next: () => void): Promise<void> {
    // Extract user ID from the request user object
    const authUserID = request.user?.id;

    // Extract user ID from the path parameters
    const { id, userId } = request.params;
    
    // Check if the request is POST, PUT, or DELETE
    const method = request.method;

    if (method === 'POST' && userId !== authUserID) {
      // For POST request, check if userID matches with authUserID
      response.status(401).json(unauthenticatedResponse);
    } else if ((method === 'PUT' || method === 'DELETE') && id !== authUserID) {
      // For PUT and DELETE requests, check if id matches with authUserID
      response.status(401).json(unauthenticatedResponse);
    } else {
      // If user IDs match, allow the operation
      next();
    }
  }

  // Error handling middleware
  error(error: Error, request: { headers: RequestHeaders; user?: Partial<User> }, response: ResponseMethods): void {
    // Send Unauthorized response for any errors
    response.status(401).json(unauthenticatedResponse);
  }
}
