import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createExpressServer } from 'routing-controllers';
import { UserController, RoleController, ProtocolController, TagController, AuthenticationController, VideoContentController } from '../api/v1/controllers';
import Server from '../app';
import { TextContentController } from '../api/v1/controllers/text.controller';
import { VoteController } from '../api/v1/controllers/vote.controller';
import { WalletController } from '../api/v1/controllers/wallet.controller';

// Define a loader for initializing Express server with routing-controllers
export const expressInitLoader: MicroframeworkLoader = (settings?: MicroframeworkSettings) => {
  // Create an Express server using routing-controllers
  const app = createExpressServer({
    // Specify the controllers to be registered with routing-controllers
    controllers: [
      UserController,
      RoleController,
      ProtocolController,
      TagController,
      AuthenticationController,
      VideoContentController,
      TextContentController,
      VoteController,
      WalletController
    ],
  });

  // Initialize the server instance with the Express app
  new Server(app);
  // Store the Express app in Microframework settings for later access
  settings?.setData('express_app', app);
};
