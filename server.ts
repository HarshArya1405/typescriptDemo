import express, { Application } from 'express';
import Server from './src/app';

const app: Application = express();
new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app
  .listen(PORT, 'localhost', function () {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on('error', (err: Error) => {
    if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      console.log('Error: address already in use');
    } else {
      console.log(err);
    }
  });