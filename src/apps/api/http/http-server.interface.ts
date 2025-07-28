export interface HttpServer<TInstance = unknown> {
  start(): Promise<void>;
  stop(): Promise<void>;
  getInstance(): TInstance;
}
