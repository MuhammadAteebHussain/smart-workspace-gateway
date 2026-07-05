export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  apiVersion: process.env.API_VERSION ?? '1',
  services: {
    auth: process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001',
  },
});
