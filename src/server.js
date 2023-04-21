import Hapi from '@hapi/hapi';
import routes from './routes.js';
import dotenv  from "dotenv";

dotenv.config()

const init = async () => {
    const server = Hapi.server({
      port: process.env.SERVER_PORT,
      host: process.env.SERVER_HOST,
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });

    server.route(routes);
   
    await server.start();
    console.log(`Server run on ${server.info.uri}`);
  };
   
   
  init();