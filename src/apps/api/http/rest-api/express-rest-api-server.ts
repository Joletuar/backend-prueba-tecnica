import type * as http from 'node:http';

import cors from 'cors';
import express, { type Router } from 'express';
import PromiseRouter from 'express-promise-router';
import helmet from 'helmet';

import type { HttpServer } from '../http-server.interface';
import { addRequestId } from './middlewares/add-request-id.middleware';
import { httpErrorHandler } from './middlewares/http-error-handler.middleware';
import { notFoundRoute } from './middlewares/not-found-route.middleware';
import type { RegistarRoute } from './routes/registar-route';

interface ServerProps {
  port: number;
  environment: 'production' | 'development' | 'test';
  routes: RegistarRoute[];
}

export class ExpressRestApiServer implements HttpServer<http.Server> {
  private readonly express: express.Express;
  private readonly port: number;
  private readonly routes: RegistarRoute[];
  httpServer?: http.Server;

  constructor(props: ServerProps) {
    const { port, routes } = props;

    this.express = express();

    this.port = port;
    this.routes = routes;
  }

  async start(): Promise<void> {
    this.setup();

    return new Promise((resolve, reject) => {
      this.httpServer = this.express.listen(this.port, () => {
        try {
          console.info(
            `App is running at http://localhost:${this.port} in ${this.express.get('env')} mode`
          );
          console.info('Press CTRL-C to stop');

          resolve();
        } catch (error) {
          console.error(error);

          reject(error);
        }
      });
    });
  }

  private setup(): void {
    this.express.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
      })
    );
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(helmet());

    const router = PromiseRouter();
    this.express.use('/api/v1', router);

    router.use(addRequestId);

    this.registerRoutes(router);

    router.use(notFoundRoute);

    this.express.use(httpErrorHandler);
  }

  private registerRoutes(router: Router): void {
    this.routes.forEach((route) => {
      route.register(router);
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close((error) => {
          if (error) {
            console.error(error);

            return reject(error);
          }

          return resolve();
        });
      }

      return resolve();
    });
  }

  getInstance(): http.Server {
    if (!this.httpServer) throw new Error('Http server is not configured yet.');

    return this.httpServer;
  }
}
