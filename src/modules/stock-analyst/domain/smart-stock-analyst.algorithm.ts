import { ulid } from 'ulidx';

import type { Stock } from '../../stock/domain/stock.entity';
import type { StockPriceData } from './external-data-provider.interface';
import type { StockAnalystAlgorithm } from './stock-analyst-algorithm.interface';
import type { StockAnalyst } from './stock-analyst.entity';

export class SmartStockAnalystAlgorithm implements StockAnalystAlgorithm {
  private readonly RATING_SCORES = {
    'Strong Buy': 5,
    'Buy': 4,
    'Hold': 3,
    'Neutral': 3,
    'Sell': 2,
    'Strong Sell': 1,
    'Underperform': 2,
    'Outperform': 4,
    'Overweight': 4,
    'Underweight': 2,
    'Equal Weight': 3,
    'Market Perform': 3,
  };

  private readonly ACTION_MULTIPLIERS = {
    upgrade: 1.5,
    downgrade: 0.5,
    initiate: 1.2,
    maintain: 1.0,
    reiterate: 1.0,
  };

  calculateScore(stock: Stock, priceData: StockPriceData | null): number {
    let score = 0;

    // 1. Rating improvement score (40% weight)
    const ratingFromScore = this.getRatingScore(stock.ratingFrom);
    const ratingToScore = this.getRatingScore(stock.ratingTo);
    const ratingImprovement = (ratingToScore - ratingFromScore) * 8; // Max 32 points
    score += ratingImprovement;

    // 2. Target price potential (30% weight)
    if (priceData && priceData.currentPrice > 0) {
      const potentialGrowth =
        ((stock.targetTo - priceData.currentPrice) / priceData.currentPrice) *
        100;

      // Cap at 30 points for 50%+ growth potential
      const growthScore = Math.min(potentialGrowth * 0.6, 30);

      score += growthScore;
    } else {
      // If no current price, use target increase as proxy
      const targetIncrease =
        ((stock.targetTo - stock.targetFrom) / stock.targetFrom) * 100;

      const growthScore = Math.min(targetIncrease * 0.4, 20);

      score += growthScore;
    }

    // 3. Action type score (20% weight)
    const actionMultiplier = this.getActionMultiplier(
      stock.action.toLowerCase()
    );

    const actionScore = ratingToScore * actionMultiplier * 2; // Max ~20 points

    score += actionScore;

    // 4. Recency bonus (10% weight)
    const daysSinceAnalysis = Math.floor(
      (Date.now() - stock.time.getTime()) / (1000 * 60 * 60 * 24)
    );

    const recencyScore = Math.max(10 - daysSinceAnalysis * 0.5, 0); // Max 10 points for recent analysis

    score += recencyScore;

    // 5. Absolute target price bonus (small factor)
    if (stock.targetTo > 100) score += 2; // Slight bonus for high-value stocks

    return Math.round(score * 10) / 10; // Round to 1 decimal
  }

  generateReason(stock: Stock, priceData: StockPriceData | null): string {
    const reasons: string[] = [];

    // Rating change analysis
    if (stock.ratingFrom !== stock.ratingTo) {
      const isUpgrade =
        this.getRatingScore(stock.ratingTo) >
        this.getRatingScore(stock.ratingFrom);

      const changeType = isUpgrade ? 'mejoró' : 'redujo';

      reasons.push(
        `${stock.brokerage} ${changeType} el rating de ${stock.ratingFrom} a ${stock.ratingTo}`
      );
    } else {
      reasons.push(`${stock.brokerage} mantiene rating ${stock.ratingTo}`);
    }

    // Price target analysis
    if (priceData && priceData.currentPrice > 0) {
      const potentialGrowth =
        ((stock.targetTo - priceData.currentPrice) / priceData.currentPrice) *
        100;

      if (potentialGrowth > 0) {
        reasons.push(
          `con potencial de crecimiento del ${potentialGrowth.toFixed(1)}% (precio actual $${priceData.currentPrice.toFixed(2)} vs objetivo $${stock.targetTo})`
        );
      } else {
        reasons.push(
          `precio actual $${priceData.currentPrice.toFixed(2)} vs objetivo $${stock.targetTo}`
        );
      }
    } else {
      const targetIncrease =
        ((stock.targetTo - stock.targetFrom) / stock.targetFrom) * 100;

      if (targetIncrease > 0) {
        reasons.push(
          `precio objetivo aumentó ${targetIncrease.toFixed(1)}% de $${stock.targetFrom} a $${stock.targetTo}`
        );
      }
    }

    // Action context
    const actionText = this.getActionDescription(stock.action.toLowerCase());
    if (actionText) {
      reasons.push(actionText);
    }

    // Recency
    const daysSinceAnalysis = Math.floor(
      (Date.now() - stock.time.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceAnalysis === 0) {
      reasons.push('análisis muy reciente');
    } else if (daysSinceAnalysis <= 7) {
      reasons.push(
        `análisis reciente (${daysSinceAnalysis} día${daysSinceAnalysis === 1 ? '' : 's'})`
      );
    }

    return `Recomendado porque ${reasons.join(', ')}.`;
  }

  createAnalysis(stock: Stock, priceData: StockPriceData | null): StockAnalyst {
    const score = this.calculateScore(stock, priceData);
    const reason = this.generateReason(stock, priceData);

    const currentPrice = priceData?.currentPrice || 0;
    const potentialGrowth =
      currentPrice > 0
        ? ((stock.targetTo - currentPrice) / currentPrice) * 100
        : ((stock.targetTo - stock.targetFrom) / stock.targetFrom) * 100;

    return {
      id: ulid(),
      stockId: stock.id,
      currentPrice,
      potentialGrowth: Math.round(potentialGrowth * 10) / 10,
      score,
      reason,
    };
  }

  private getRatingScore(rating: string): number {
    return this.RATING_SCORES[rating as keyof typeof this.RATING_SCORES] || 3;
  }

  private getActionMultiplier(action: string): number {
    return (
      this.ACTION_MULTIPLIERS[action as keyof typeof this.ACTION_MULTIPLIERS] ||
      1.0
    );
  }

  private getActionDescription(action: string): string {
    switch (action) {
      case 'upgrade':
        return 'acción de mejora';
      case 'downgrade':
        return 'acción de rebaja';
      case 'initiate':
        return 'cobertura iniciada';
      case 'maintain':
        return 'posición mantenida';
      case 'reiterate':
        return 'posición reiterada';
      default:
        return '';
    }
  }
}
