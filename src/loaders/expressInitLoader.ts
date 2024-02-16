import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createExpressServer } from 'routing-controllers';
import { TaskController, UserController,RoleController } from '../api/controllers';
import Server from '../app';

export const expressInitLoader: MicroframeworkLoader = (settings?: MicroframeworkSettings) => {
  const app = createExpressServer({
    controllers: [TaskController, UserController,RoleController], // Register the TaskController and UserController
  });

  new Server(app);
  settings?.setData('express_app', app);
};

