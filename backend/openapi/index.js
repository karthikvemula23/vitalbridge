import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "VitalBridge API",
      version: "1.0.0",
      description: "RESTful API for the VitalBridge blood donation and inventory management platform.",
    },
  },
  apis: ['./openapi/*.js'],
};

// setup 
const swaggerDocs = swaggerJsDoc(swaggerOptions);

export {
  swaggerDocs,
  swaggerUi
}
