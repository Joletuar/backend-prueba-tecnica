import type { Server } from 'node:http';

import request from 'supertest';

import { ApiApp } from '../../../../../../src/apps/api';

export class TestApiServer {
  private app: ApiApp;
  private server?: Server;

  constructor() {
    this.app = new ApiApp();
  }

  async setup(): Promise<void> {
    process.env['NODE_ENV'] = 'test';
    process.env['PORT'] = '0';

    await this.app.init();

    this.server = this.app.getServer().getInstance() as Server;
  }

  async teardown(): Promise<void> {
    await this.app.close();
  }

  get request(): ReturnType<typeof request> {
    if (!this.server) {
      throw new Error('Test server not setup. Call setup() first.');
    }

    return request(this.server);
  }

  get apiApp(): ApiApp {
    return this.app;
  }
}
