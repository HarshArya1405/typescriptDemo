import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import axios, { AxiosResponse } from 'axios';
import jwt, { Jwt, JwtHeader, JwtPayload } from 'jsonwebtoken';
import jwkToPem, { JWK } from 'jwk-to-pem';
import { AppDataSource } from '../../../loaders/typeormLoader';

// Import your database module or ORM here
import { User } from '../../models'; // Assuming you have a User model representing your database users

const userRepository = AppDataSource.getRepository(User);

// Define the type for request headers
interface RequestHeaders {
  authorization?: string;
}

// Define the type for response methods
interface ResponseMethods {
  status(code: number): ResponseMethods;
  json(data: object): ResponseMethods;
}

// Define the type for decoded token
interface DecodedToken {
  header: JwtHeader;
  payload: JwtPayload;
}

// Middleware for handling authentication
@Middleware({ type: 'before' })
export class AuthMiddleware implements ExpressErrorMiddlewareInterface {
  async use(request: { headers: RequestHeaders; user?: DecodedToken }, response: ResponseMethods, next: () => void): Promise<void> {
    // Extract authorization header from request
    const authHeader = request.headers.authorization;
    
    // Check if authorization header is missing or not starting with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      response.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Extract access token from authorization header
    const accessToken = authHeader.split(' ')[1];

    try {
      // Fetch JSON Web Key Set from Auth0 endpoint
      const { data }: AxiosResponse<{ keys: JWK[] }> = await axios.get('https://dev-1ybxpbw81aybsqes.us.auth0.com/.well-known/jwks.json');
      const jwks: JWK[] = data.keys;

      // Decode the access token to extract header information
      const decodedToken = jwt.decode(accessToken, { complete: true }) as Jwt | null;

      if (!decodedToken || !('header' in decodedToken)) {
        response.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { header } = decodedToken;

      // Extract 'kid' from decoded token header
      const { kid }: JwtHeader = header;

      // Find the JWK corresponding to the 'kid' in the JSON Web Key Set
      const jwk: JWK | undefined = jwks.find((key: JWK) => {
        return 'kid' in key && key.kid === kid;
      });

      if (!jwk) {
        response.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Convert JWK to PEM format
      const pem: string = jwkToPem(jwk);

      // Verify the access token using the PEM public key
      try {
        const decoded = jwt.verify(
          accessToken,
          pem,
          { algorithms: ['RS256'], complete: true }
        ) as Jwt;

        console.log('DECODED', decoded);
        

        const { payload } = decoded;

        if (typeof payload === 'object' && payload !== null && 'email' in payload) {
          const { email } = payload;

          // Check if the email exists in the database
          try {
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
              response.status(401).json({ message: 'Unauthorized' });
              return;
            }

            // If user exists in the database, set the user information in the request and call the next middleware
            request.user = { header, payload };
            next();
          } catch (error) {
            console.error('Error querying the database:', error);
            response.status(500).json({ message: 'Internal Server Error' });
          }          
        } else {
          response.status(401).json({ message: 'Unauthorized' });
        }
      } catch (error) {
        // If verification fails, send Unauthorized response
        response.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      // Catch any errors and send Unauthorized response
      response.status(401).json({ message: 'Unauthorized' });
    }
  }

  // Error handling middleware
  error(error: Error, request: { headers: RequestHeaders; user?: DecodedToken }, response: ResponseMethods): void {
    // Send Unauthorized response for any errors
    response.status(401).json({ message: 'Unauthorized' });
  }
}
