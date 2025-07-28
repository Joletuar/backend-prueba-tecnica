import { ConfigProvider } from './config/app-config';
import { stockRoute } from './dependencies/stock';
import { stockAnalystRoute } from './dependencies/stock-analyst';
import type { HttpServer } from './http/http-server.interface';
import { ExpressRestApiServer } from './http/rest-api/express-rest-api-server';

export class ApiApp {
  private readonly config = ConfigProvider.getConfig();
  readonly server: HttpServer;

  constructor() {
    this.server = new ExpressRestApiServer({
      environment: this.config.http.environment,
      port: this.config.http.port,
      routes: [stockRoute, stockAnalystRoute],
    });
  }

  async init(): Promise<void> {
    try {
      await this.server.start();
    } catch (error) {
      console.error('Error starting server:', error);

      throw error;
    }
  }

  async close(): Promise<void> {
    await this.server.stop();
  }

  getServer(): HttpServer {
    return this.server;
  }
}
