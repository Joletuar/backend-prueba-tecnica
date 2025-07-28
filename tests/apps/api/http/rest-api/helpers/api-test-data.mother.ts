export class ApiTestDataMother {
  static createValidCursor(): string {
    const cursorData = 'AAPL:stock-123:Sun, 25 Jul 2025 05:00:00 GMT';

    return Buffer.from(cursorData).toString('base64');
  }

  static createInvalidCursor(): string {
    return 'invalid-cursor';
  }

  static createMockStocks(): any[] {
    return [
      {
        id: 'stock-1',
        ticker: 'AAPL',
        companyName: 'Apple Inc.',
        brokerage: 'Goldman Sachs',
        action: 'UPGRADE',
        ratingFrom: 'HOLD',
        ratingTo: 'BUY',
        targetFrom: 150.0,
        targetTo: 180.0,
        time: 'Sun, 15 Jan 2023 10:00:00 GMT',
      },
      {
        id: 'stock-2',
        ticker: 'MSFT',
        companyName: 'Microsoft Corporation',
        brokerage: 'Morgan Stanley',
        action: 'INITIATE',
        ratingFrom: 'N/A',
        ratingTo: 'OVERWEIGHT',
        targetFrom: 0.0,
        targetTo: 350.0,
        time: 'Mon, 16 Jan 2023 09:30:00 GMT',
      },
    ];
  }

  static createPaginatedResponse(
    data: any[],
    next: string | null = null,
    prev: string | null = null
  ): any {
    return {
      data,
      pagination: {
        next,
        prev,
      },
    };
  }
}
