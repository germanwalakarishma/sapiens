import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management',
      version: '1.0.0',
      description: 'User Management API',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated user ID'
            },
            firstName: {
              type: 'string',
              maxLength: 100,
              description: 'User first name (alphabetical only)'
            },
            lastName: {
              type: 'string',
              maxLength: 100,
              description: 'User last name (alphabetical only)'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address (must be unique)'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts','./src/controller/*.ts'],
};

const swaggerSpec =swaggerJSDoc(options);
export default swaggerSpec;