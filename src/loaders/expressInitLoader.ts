import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createExpressServer } from 'routing-controllers';
import { UserController, RoleController, ProtocolController, TagController, AuthenticationController, VideoContentController, VoteController, YoutubeController, WalletController } from '../api/v1/controllers';
import express from 'express';
import { CorsOptions } from 'cors';
import ENV from './../config/environments';
import { requestLogger } from './../util/request.logger';

// Define a loader for initializing Express server with routing-controllers
export const expressInitLoader: MicroframeworkLoader = (settings?: MicroframeworkSettings) => {
 
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || ENV.whitelistUrls.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ENV.methods,
    credentials: true,
    exposedHeaders: 'set-cookie'
  };

  const app = createExpressServer({
    cors: corsOptions,
    controllers: [
      UserController,
      RoleController,
      ProtocolController,
      TagController,
      AuthenticationController,
      VideoContentController,
      VoteController,
      YoutubeController,
      WalletController
    ],
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Logging incoming requests
  app.use(requestLogger);
  // Store the Express app in Microframework settings for later access
  settings?.setData('express_app', app);
};
