import type { StockAnalyst } from '../../../../../src/modules/stock-analyst/domain/stock-analyst.entity';

export class StockAnalystMother {
  static nvidia(): StockAnalyst {
    return {
      id: '1',
      stockId: '1',
      currentPrice: 160,
      potentialGrowth: 25,
      score: 85,
      reason:
        'Recomendado porque Goldman Sachs mejoró su calificación de Neutral a Buy con un precio objetivo de $200, indicando un potencial de crecimiento del 25.0%.',
    };
  }

  static tesla(): StockAnalyst {
    return {
      id: '2',
      stockId: '2',
      currentPrice: 280,
      potentialGrowth: -10.7,
      score: 15,
      reason:
        'Recomendado porque Morgan Stanley redujo su calificación de Buy a Hold, señalando una posible rebaja en las expectativas.',
    };
  }

  static apple(): StockAnalyst {
    return {
      id: '3',
      stockId: '3',
      currentPrice: 180,
      potentialGrowth: 22.2,
      score: 45,
      reason:
        'Recomendado porque JP Morgan mantuvo su calificación Buy con un precio objetivo de $220, indicando un potencial de crecimiento del 22.2%.',
    };
  }

  static createMany(): StockAnalyst[] {
    return [this.nvidia(), this.tesla(), this.apple()];
  }

  static createWithScore(score: number): StockAnalyst {
    return {
      ...this.nvidia(),
      score,
    };
  }
}
