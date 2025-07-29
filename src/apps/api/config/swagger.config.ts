import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stock API',
      version: '1.0.0',
      description: 'API para gestión y análisis de stocks',
    },
    components: {
      schemas: {
        Stock: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'ulid',
              description: 'ID único del stock',
            },
            ticker: {
              type: 'string',
              description: 'Símbolo del ticker del stock',
            },
            companyName: {
              type: 'string',
              description: 'Nombre de la compañía',
            },
            brokerage: {
              type: 'string',
              description: 'Casa de corretaje',
            },
            action: {
              type: 'string',
              description: 'Acción recomendada',
            },
            ratingFrom: {
              type: 'string',
              description: 'Rating anterior',
            },
            ratingTo: {
              type: 'string',
              description: 'Rating actualizado',
            },
            targetFrom: {
              type: 'number',
              description: 'Precio objetivo anterior',
            },
            targetTo: {
              type: 'number',
              description: 'Precio objetivo actualizado',
            },
            time: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de la recomendación',
            },
          },
          required: [
            'id',
            'ticker',
            'companyName',
            'brokerage',
            'action',
            'ratingFrom',
            'ratingTo',
            'targetFrom',
            'targetTo',
            'time',
          ],
        },
        PaginatedStocks: {
          allOf: [
            {
              $ref: '#/components/schemas/ApiCursorPaginatedResponse',
            },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Stock',
                  },
                },
              },
            },
          ],
        },
        StockAnalyst: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'ulid',
              description: 'ID único del análisis',
            },
            stockId: {
              type: 'string',
              format: 'ulid',
              description: 'ID del stock analizado',
            },
            currentPrice: {
              type: 'number',
              description: 'Precio actual del stock',
            },
            potentialGrowth: {
              type: 'number',
              description: 'Crecimiento potencial estimado',
            },
            score: {
              type: 'number',
              description: 'Puntuación del análisis',
            },
            reason: {
              type: 'string',
              description: 'Razón del análisis',
            },
          },
          required: [
            'id',
            'stockId',
            'currentPrice',
            'potentialGrowth',
            'score',
            'reason',
          ],
        },
        ApiSuccessResponse: {
          type: 'object',
          properties: {
            data: {
              description: 'Datos de la respuesta',
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Marca de tiempo de la respuesta',
                },
                requestId: {
                  type: 'string',
                  description: 'ID único de la solicitud',
                },
              },
              required: ['timestamp', 'requestId'],
            },
          },
          required: ['data', 'meta'],
        },
        ApiCursorPaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              description: 'Array de datos paginados',
            },
            meta: {
              type: 'object',
              properties: {
                pagination: {
                  type: 'object',
                  properties: {
                    next: {
                      type: 'string',
                      nullable: true,
                      description: 'Cursor para la siguiente página',
                    },
                    prev: {
                      type: 'string',
                      nullable: true,
                      description: 'Cursor para la página anterior',
                    },
                  },
                  required: ['next', 'prev'],
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Marca de tiempo de la respuesta',
                },
                requestId: {
                  type: 'string',
                  description: 'ID único de la solicitud',
                },
              },
              required: ['pagination', 'timestamp', 'requestId'],
            },
          },
          required: ['data', 'meta'],
        },
        ApiErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  description: 'Código de estado HTTP',
                },
                requestId: {
                  type: 'string',
                  description: 'ID único de la solicitud',
                },
                message: {
                  type: 'string',
                  description: 'Mensaje de error',
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Marca de tiempo del error',
                },
              },
              required: ['statusCode', 'requestId', 'message', 'timestamp'],
            },
          },
          required: ['error'],
        },
      },
      responses: {
        BadRequest: {
          description: 'Solicitud incorrecta',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiErrorResponse',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/apps/api/http/rest-api/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
