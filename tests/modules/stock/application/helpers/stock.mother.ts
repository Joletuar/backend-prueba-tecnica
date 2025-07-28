import type { StockDto } from '../../../../../src/modules/stock/application/stock.dto';
import type { StockCursor } from '../../../../../src/modules/stock/domain/stock-cursor';
import type { Stock } from '../../../../../src/modules/stock/domain/stock.entity';

export class StockMother {
  static create(overrides: Partial<Stock> = {}): Stock {
    return {
      id: 'stock-123',
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      brokerage: 'Goldman Sachs',
      action: 'UPGRADE',
      ratingFrom: 'HOLD',
      ratingTo: 'BUY',
      targetFrom: 150.0,
      targetTo: 180.0,
      time: new Date('2023-01-15T10:00:00Z'),
      ...overrides,
    };
  }

  static createDto(overrides: Partial<StockDto> = {}): StockDto {
    return {
      id: 'stock-123',
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      brokerage: 'Goldman Sachs',
      action: 'UPGRADE',
      ratingFrom: 'HOLD',
      ratingTo: 'BUY',
      targetFrom: 150.0,
      targetTo: 180.0,
      time: 'Sun, 15 Jan 2023 10:00:00 GMT',
      ...overrides,
    };
  }

  static createList(count: number = 3): Stock[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        id: `stock-${index + 1}`,
        ticker: ['AAPL', 'MSFT', 'GOOGL'][index] || 'AAPL',
        companyName:
          ['Apple Inc.', 'Microsoft Corporation', 'Alphabet Inc.'][index] ||
          'Apple Inc.',
      })
    );
  }

  static nvidia(overrides: Partial<Stock> = {}): Stock {
    return this.create({
      id: '1',
      ticker: 'NVDA',
      companyName: 'NVIDIA Corporation',
      brokerage: 'Goldman Sachs',
      action: 'upgrade',
      ratingFrom: 'Hold',
      ratingTo: 'Buy',
      targetFrom: 150.0,
      targetTo: 200.0,
      time: new Date('2023-01-15T10:00:00Z'),
      ...overrides,
    });
  }

  static tesla(overrides: Partial<Stock> = {}): Stock {
    return this.create({
      id: '2',
      ticker: 'TSLA',
      companyName: 'Tesla Inc.',
      brokerage: 'Morgan Stanley',
      action: 'downgrade',
      ratingFrom: 'Buy',
      ratingTo: 'Hold',
      targetFrom: 300.0,
      targetTo: 250.0,
      time: new Date('2023-01-14T09:00:00Z'),
      ...overrides,
    });
  }

  static apple(overrides: Partial<Stock> = {}): Stock {
    return this.create({
      id: '3',
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      brokerage: 'JP Morgan',
      action: 'maintain',
      ratingFrom: 'Buy',
      ratingTo: 'Buy',
      targetFrom: 180.0,
      targetTo: 220.0,
      time: new Date('2023-01-13T14:00:00Z'),
      ...overrides,
    });
  }
}

export class StockCursorMother {
  static create(overrides: Partial<StockCursor> = {}): StockCursor {
    return {
      id: 'stock-123',
      ...overrides,
    };
  }

  static encode(cursor: StockCursor): string {
    return Buffer.from(cursor.id).toString('base64');
  }
}
