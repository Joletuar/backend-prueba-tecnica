import type { Stock } from '../../../../../src/modules/stock/domain/stock.entity';

export class StockMother {
  static nvidia(): Stock {
    return {
      id: '1',
      ticker: 'NVDA',
      companyName: 'NVIDIA Corporation',
      brokerage: 'Goldman Sachs',
      action: 'upgrade',
      ratingFrom: 'Neutral',
      ratingTo: 'Buy',
      targetFrom: 180,
      targetTo: 200,
      time: new Date('2024-01-15T10:00:00Z'),
    };
  }

  static tesla(): Stock {
    return {
      id: '2',
      ticker: 'TSLA',
      companyName: 'Tesla Inc',
      brokerage: 'Morgan Stanley',
      action: 'downgrade',
      ratingFrom: 'Buy',
      ratingTo: 'Hold',
      targetFrom: 300,
      targetTo: 250,
      time: new Date('2024-01-14T10:00:00Z'),
    };
  }

  static apple(): Stock {
    return {
      id: '3',
      ticker: 'AAPL',
      companyName: 'Apple Inc',
      brokerage: 'JP Morgan',
      action: 'maintain',
      ratingFrom: 'Buy',
      ratingTo: 'Buy',
      targetFrom: 200,
      targetTo: 220,
      time: new Date('2024-01-16T10:00:00Z'),
    };
  }

  static createMany(): Stock[] {
    return [this.nvidia(), this.tesla(), this.apple()];
  }
}
