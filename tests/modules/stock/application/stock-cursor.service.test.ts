import { AppError } from '../../../../src/modules/shared/domain/errors/app.error';
import { StockCursorService } from '../../../../src/modules/stock/application/stock-cursor.service';
import { StockCursorMother } from './helpers/stock.mother';

const encoder = (value: string): string =>
  Buffer.from(value).toString('base64');

describe('StockCursorService', () => {
  describe('#encode', () => {
    it('should encode cursor to base64 string', () => {
      const cursor = StockCursorMother.create();

      const result = StockCursorService.encode(cursor);

      expect(result).toBe(encoder(cursor.id));
    });

    it('should encode different cursor correctly', () => {
      const cursor = StockCursorMother.create({
        id: 'rec-456',
      });

      const result = StockCursorService.encode(cursor);

      expect(result).toBe(encoder(cursor.id));
    });
  });

  describe('#decode', () => {
    it('should decode valid base64 cursor', () => {
      const originalCursor = StockCursorMother.create();
      const encodedCursor = encoder(originalCursor.id);

      const result = StockCursorService.decode(encodedCursor);

      expect(result).toEqual({ id: originalCursor.id });
    });

    it('should throw AppError for invalid base64', () => {
      const invalidCursor = 'invalid-cursor';

      expect(() => StockCursorService.decode(invalidCursor)).toThrow(AppError);
      expect(() => StockCursorService.decode(invalidCursor)).toThrow(
        'Invalid cursor format'
      );
    });

    it('should throw AppError for empty cursor', () => {
      const invalidFormat = encoder('');

      expect(() => StockCursorService.decode(invalidFormat)).toThrow(AppError);
      expect(() => StockCursorService.decode(invalidFormat)).toThrow(
        'Invalid cursor format'
      );
    });
  });
});
