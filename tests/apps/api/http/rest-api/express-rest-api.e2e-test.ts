import httpStatus from 'http-status';

import { ApiTestDataMother } from './helpers/api-test-data.mother';
import { TestApiServer } from './helpers/test-api-server';

describe('Express Rest API', () => {
  let testServer: TestApiServer;

  beforeAll(async () => {
    testServer = new TestApiServer();

    await testServer.setup();
  });

  afterAll(async () => {
    await testServer.teardown();
  });

  describe('/api/v1/stocks', () => {
    const PATH = '/api/v1/stocks';

    describe('GET /', () => {
      it('should return stocks successfully', async () => {
        // Act
        const response = await testServer.request
          .get(PATH)
          .expect(httpStatus.OK);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.meta).toHaveProperty('pagination');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta.pagination).toHaveProperty('next');
        expect(response.body.meta.pagination).toHaveProperty('prev');
      });

      it('should return stocks with valid limit parameter', async () => {
        // Arrange
        const limit = 5;

        // Act
        const response = await testServer.request
          .get(PATH)
          .query({ limit })
          .expect(httpStatus.OK);

        // Assert
        expect(response.body.data.length).toBeLessThanOrEqual(limit);
      });

      it('should return error for invalid limit parameter', async () => {
        // Arrange
        const invalidLimit = 101;

        // Act
        const response = await testServer.request
          .get(PATH)
          .query({ limit: invalidLimit })
          .expect(httpStatus.BAD_REQUEST);

        // Assert
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('message');
        expect(response.body.error.message).toContain(
          'Limit must be between 1 and 100'
        );
      });

      it('should return error for zero limit', async () => {
        // Arrange
        const invalidLimit = 0;

        // Act
        const response = await testServer.request
          .get(PATH)
          .query({ limit: invalidLimit })
          .expect(httpStatus.BAD_REQUEST);

        // Assert
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('message');
        expect(response.body.error.message).toContain(
          'Limit must be between 1 and 100'
        );
      });

      it('should return error for negative limit', async () => {
        // Arrange
        const invalidLimit = -1;

        // Act
        const response = await testServer.request
          .get(PATH)
          .query({ limit: invalidLimit })
          .expect(httpStatus.BAD_REQUEST);

        // Assert
        expect(response.body).toHaveProperty('error');
      });

      it('should return error when both next and prev cursors are provided', async () => {
        // Arrange
        const nextCursor = ApiTestDataMother.createValidCursor();
        const prevCursor = ApiTestDataMother.createValidCursor();

        // Act
        const response = await testServer.request
          .get(PATH)
          .query({ next: nextCursor, prev: prevCursor })
          .expect(httpStatus.BAD_REQUEST);

        // Assert
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('message');
        expect(response.body.error.message).toContain(
          'Cannot provide both next and prev cursors'
        );
      });

      it('should handle pagination with next cursor', async () => {
        const firstResponse = await testServer.request
          .get(PATH)
          .query({ limit: 1 })
          .expect(httpStatus.OK);

        if (firstResponse.body.meta.pagination.next) {
          const response = await testServer.request
            .get(PATH)
            .query({ next: firstResponse.body.meta.pagination.next })
            .expect(httpStatus.OK);

          // Assert
          expect(response.body).toHaveProperty('data');
          expect(response.body).toHaveProperty('meta');
          expect(response.body.meta).toHaveProperty('pagination');
        }
      });

      it('should handle pagination with prev cursor', async () => {
        const firstResponse = await testServer.request
          .get(PATH)
          .query({ limit: 1 })
          .expect(httpStatus.OK);

        if (firstResponse.body.meta.pagination.next) {
          const secondResponse = await testServer.request
            .get(PATH)
            .query({ next: firstResponse.body.meta.pagination.next })
            .expect(httpStatus.OK);

          if (secondResponse.body.meta.pagination.prev) {
            const response = await testServer.request
              .get(PATH)
              .query({ prev: secondResponse.body.meta.pagination.prev })
              .expect(httpStatus.OK);

            // Assert
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(response.body.meta).toHaveProperty('pagination');
          }
        }
      });

      it('should return error for invalid cursor format', async () => {
        // Arrange
        const invalidCursor = ApiTestDataMother.createInvalidCursor();

        // Act
        const response = await testServer.request
          .get(PATH)
          .query({ next: invalidCursor })
          .expect(httpStatus.BAD_REQUEST);

        // Assert
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('message');
        expect(response.body.error.message).toContain('Invalid cursor format');
      });
    });

    describe('GET /brokerages', () => {
      const BROKERAGES_PATH = '/api/v1/stocks/brokerages';

      it('should return all unique brokerages successfully', async () => {
        // Act
        const response = await testServer.request
          .get(BROKERAGES_PATH)
          .expect(httpStatus.OK);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.meta).toHaveProperty('timestamp');
        expect(response.body.meta).toHaveProperty('requestId');

        response.body.data.forEach((brokerage: any) => {
          expect(typeof brokerage).toBe('string');
        });
      });

      it('should include correct response structure', async () => {
        // Act
        const response = await testServer.request
          .get(BROKERAGES_PATH)
          .expect(httpStatus.OK);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.meta).toHaveProperty('timestamp');
        expect(response.body.meta).toHaveProperty('requestId');
        expect(typeof response.body.meta.timestamp).toBe('string');
        expect(typeof response.body.meta.requestId).toBe('string');
      });
    });
  });

  describe('/api/v1/stock-analyst', () => {
    const PATH = '/api/v1/stock-analyst';

    describe('GET /best', () => {
      it('should return 200 when stock analyst recommendation exists', async () => {
        // Act
        const response = await testServer.request
          .get(`${PATH}/best`)
          .expect(httpStatus.OK);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
      });
    });

    describe('GET /stock/:stockId', () => {
      it('should return empty array for any stock id when no analysis exists', async () => {
        // Arrange
        const stockId = '01HYSQZ9K8W2XKQJ3F7P6N8M9T'; // Valid ULID

        // Act
        const response = await testServer.request
          .get(`${PATH}/stock/${stockId}`)
          .expect(httpStatus.OK);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });

      it('should return empty array for non-existent stock id', async () => {
        // Arrange
        const stockId = '01HYSQZ9K8W2XKQJ3F7P6N8M9Z'; // Valid ULID

        // Act
        const response = await testServer.request
          .get(`${PATH}/stock/${stockId}`)
          .expect(httpStatus.OK);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });

      it('should return 400 for invalid stock id format', async () => {
        // Arrange
        const invalidStockId = 'invalid-id'; // Invalid ULID format

        // Act
        const response = await testServer.request
          .get(`${PATH}/stock/${invalidStockId}`)
          .expect(httpStatus.BAD_REQUEST);

        // Assert
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('message');
      });

      it('should handle valid ULID format stock id', async () => {
        // Arrange
        const stockId = '01HYSQZ9K8W2XKQJ3F7P6N8M9A'; // Valid ULID

        // Act
        const response = await testServer.request
          .get(`${PATH}/stock/${stockId}`)
          .expect(httpStatus.OK);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });

      it('should validate stock id parameter format', async () => {
        // Arrange
        const stockId = '01HYSQZ9K8W2XKQJ3F7P6N8M9B'; // Valid ULID

        // Act
        const response = await testServer.request
          .get(`${PATH}/stock/${stockId}`)
          .expect(httpStatus.OK);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('Response Format', () => {
      it('should return consistent response format for /stock/:stockId endpoint', async () => {
        // Act
        const response = await testServer.request
          .get(`${PATH}/stock/01HYSQZ9K8W2XKQJ3F7P6N8M9C`)
          .expect(httpStatus.OK);

        // Assert
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('meta');
        expect(response.body.meta).toHaveProperty('timestamp');
        expect(response.body.meta).toHaveProperty('requestId');
        expect(typeof response.body.meta.timestamp).toBe('string');
        expect(typeof response.body.meta.requestId).toBe('string');
      });
    });
  });

  describe('HTTP Methods', () => {
    it('should return 404 for unsupported HTTP method POST', async () => {
      // Act
      const response = await testServer.request
        .post('/api/v1/stocks')
        .send({})
        .expect(httpStatus.NOT_FOUND);

      // Assert
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for unsupported HTTP method PUT', async () => {
      // Act
      const response = await testServer.request
        .put('/api/v1/stocks')
        .send({})
        .expect(httpStatus.NOT_FOUND);

      // Assert
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for unsupported HTTP method DELETE', async () => {
      // Act
      const response = await testServer.request
        .delete('/api/v1/stocks')
        .expect(httpStatus.NOT_FOUND);

      // Assert
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for unsupported HTTP method POST on /brokerages', async () => {
      // Act
      const response = await testServer.request
        .post('/api/v1/stocks/brokerages')
        .send({})
        .expect(httpStatus.NOT_FOUND);

      // Assert
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 for unsupported HTTP method PUT on /brokerages', async () => {
      // Act
      const response = await testServer.request
        .put('/api/v1/stocks/brokerages')
        .send({})
        .expect(httpStatus.NOT_FOUND);

      // Assert
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Edge Cases', () => {
    const PATH = '/api/v1/stocks';

    it('should have correct response structure for successful request', async () => {
      // Act
      const response = await testServer.request
        .get(PATH)
        .query({ limit: 10 })
        .expect(httpStatus.OK);

      // Assert
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('pagination');
      expect(response.body.meta).toHaveProperty('timestamp');
      expect(response.body.meta).toHaveProperty('requestId');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(typeof response.body.meta.timestamp).toBe('string');
      expect(typeof response.body.meta.requestId).toBe('string');

      // Check data structure if items exist
      if (response.body.data.length > 0) {
        const firstItem = response.body.data[0];
        expect(firstItem).toHaveProperty('id');
        expect(firstItem).toHaveProperty('ticker');
        expect(firstItem).toHaveProperty('companyName');
        expect(firstItem).toHaveProperty('brokerage');
        expect(firstItem).toHaveProperty('action');
        expect(firstItem).toHaveProperty('ratingFrom');
        expect(firstItem).toHaveProperty('ratingTo');
        expect(firstItem).toHaveProperty('targetFrom');
        expect(firstItem).toHaveProperty('targetTo');
        expect(firstItem).toHaveProperty('time');
      }
    });

    it('should include request ID in response meta', async () => {
      // Act
      const response = await testServer.request.get(PATH).expect(httpStatus.OK);

      // Assert
      expect(response.body.meta).toHaveProperty('requestId');
      expect(response.body.meta.requestId).toBeDefined();
      expect(typeof response.body.meta.requestId).toBe('string');
    });

    it('should handle CORS headers correctly', async () => {
      // Act
      const response = await testServer.request
        .options(PATH)
        .expect(httpStatus.NO_CONTENT);

      // Assert
      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers).toHaveProperty('access-control-allow-methods');
    });
  });

  describe('Non-existent routes', () => {
    it('should return 404 for non-existent endpoint', async () => {
      // Act
      const response = await testServer.request
        .get('/api/v1/non-existent')
        .expect(httpStatus.NOT_FOUND);

      // Assert
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Route not found');
    });
  });
});
