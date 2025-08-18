byimport path from 'path';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Swiitch Bank API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Swiitch Bank application',
  },
  servers: [
    {
      url: '/api', // Adjust this if your API is served under a different base path
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, './routes/*.js'),
    path.resolve(__dirname, './controllers/*.js'),
  ], // Path to the API route and controller files
};

export default options;