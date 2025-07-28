export interface AppConfig {
  http: {
    port: number;
    environment: 'production' | 'development' | 'test';
  };
}
export const ConfigProvider = {
  getConfig(): AppConfig {
    return {
      http: {
        port: Number(process.env['PORT'] ?? 3000),
        environment:
          (process.env['NODE_ENV'] as 'production' | 'development' | 'test') ??
          'development',
      },
    };
  },
};
