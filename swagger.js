const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const PORT = process.env.PORT;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clinic API",
      version: "1.0.0",
      description: "API documentation for codemedics clinic",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./Backend/docs/*.js", "./routes/*.js"], // adjust as needed
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
