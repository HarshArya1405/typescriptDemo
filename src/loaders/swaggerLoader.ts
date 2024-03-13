import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { Application } from 'express';
import { Container } from 'typedi';
import { getMetadataArgsStorage } from 'routing-controllers';

export const swaggerLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    const expressApp: Application = settings.getData('express_app');

    const routingControllersOptions = {
      controllers: [__dirname + 'src/api/v1/controllers/*.ts'],
      container: Container,
    };

    const spec = routingControllersToSpec(getMetadataArgsStorage(), routingControllersOptions);

    expressApp.get('/api-docs', (req, res) => {
      res.json(spec);
    });
  }
};
