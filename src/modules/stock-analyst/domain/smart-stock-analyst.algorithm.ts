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
    const score = this.calculateScore(stock, priceData);
    const finalRatingScore = this.getRatingScore(stock.ratingTo);

    // Calculate growth potential
    const currentPrice = priceData?.currentPrice || 0;
    const potentialGrowth =
      currentPrice > 0
        ? ((stock.targetTo - currentPrice) / currentPrice) * 100
        : ((stock.targetTo - stock.targetFrom) / stock.targetFrom) * 100;

    // Detailed stock analysis
    const analysisPoints: string[] = [];

    // 1. Rating analysis
    if (stock.ratingFrom !== stock.ratingTo) {
      const isUpgrade =
        this.getRatingScore(stock.ratingTo) >
        this.getRatingScore(stock.ratingFrom);
      const changeType = isUpgrade
        ? 'ha mejorado su rating'
        : 'ha reducido su rating';
      const perspective = isUpgrade
        ? ', lo que refleja una perspectiva optimista'
        : ', indicando una visión más cautelosa';
      analysisPoints.push(
        `${stock.brokerage} ${changeType} de ${stock.ratingFrom} a ${stock.ratingTo}${perspective}`
      );

      if (finalRatingScore <= 2) {
        analysisPoints.push(
          `El rating final negativo (${stock.ratingTo}) sugiere precaución en la inversión`
        );
      } else if (finalRatingScore >= 4) {
        analysisPoints.push(
          `El rating final positivo (${stock.ratingTo}) es una señal favorable para los inversores`
        );
      }
    } else {
      analysisPoints.push(
        `${stock.brokerage} mantiene su rating ${stock.ratingTo}, confirmando su confianza en la acción`
      );
    }

    // 2. Growth potential analysis
    if (potentialGrowth > 10) {
      analysisPoints.push(
        `La acción presenta un alto potencial de crecimiento del ${potentialGrowth.toFixed(1)}%, lo que es muy atractivo`
      );
    } else if (potentialGrowth > 0) {
      analysisPoints.push(
        `Ofrece un potencial de crecimiento moderado del ${potentialGrowth.toFixed(1)}%`
      );
    } else if (potentialGrowth > -5) {
      analysisPoints.push(
        `Presenta un riesgo limitado con una posible pérdida del ${Math.abs(potentialGrowth).toFixed(1)}%`
      );
    } else {
      analysisPoints.push(
        `Conlleva un alto riesgo con una pérdida potencial del ${Math.abs(potentialGrowth).toFixed(1)}%`
      );
    }

    // 3. Price details
    if (priceData && priceData.currentPrice > 0) {
      const gap =
        ((stock.targetTo - priceData.currentPrice) / priceData.currentPrice) *
        100;
      const gapDescription =
        gap > 20
          ? 'una brecha significativa que sugiere oportunidad'
          : gap > 0
            ? 'potencial de apreciación'
            : 'una valoración desafiante';
      analysisPoints.push(
        `Con un precio actual de $${priceData.currentPrice.toFixed(2)} y un objetivo de $${stock.targetTo}, ${gapDescription}`
      );
    } else {
      const targetChange =
        ((stock.targetTo - stock.targetFrom) / stock.targetFrom) * 100;
      if (Math.abs(targetChange) > 0.1) {
        const direction = targetChange > 0 ? 'ha aumentado' : 'se ha reducido';
        const sentiment =
          targetChange > 0
            ? ', mostrando mayor optimismo'
            : ', reflejando expectativas más conservadoras';
        analysisPoints.push(
          `El precio objetivo ${direction} un ${Math.abs(targetChange).toFixed(1)}% de $${stock.targetFrom} a $${stock.targetTo}${sentiment}`
        );
      }
    }

    // 4. Action analysis
    const actionText = this.getActionDescription(stock.action.toLowerCase());
    if (actionText) {
      analysisPoints.push(actionText);
    }

    // 5. Recency factor
    const daysSinceAnalysis = Math.floor(
      (Date.now() - stock.time.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceAnalysis === 0) {
      analysisPoints.push('Este análisis es muy reciente, realizado hoy mismo');
    } else if (daysSinceAnalysis <= 7) {
      analysisPoints.push(
        `El análisis fue realizado hace ${daysSinceAnalysis} día${daysSinceAnalysis === 1 ? '' : 's'}, por lo que mantiene relevancia`
      );
    } else if (daysSinceAnalysis > 30) {
      analysisPoints.push(
        `El análisis tiene ${daysSinceAnalysis} días de antigüedad, por lo que podría estar desactualizado`
      );
    }

    // 6. Overall evaluation based on score
    let recommendation: string;
    if (score >= 50) {
      recommendation = 'Altamente recomendado';
    } else if (score >= 25) {
      recommendation = 'Moderadamente recomendado';
    } else if (score >= 10) {
      recommendation = 'Recomendación débil';
    } else if (score >= 0) {
      recommendation = 'No recomendado';
    } else {
      recommendation = 'Fuertemente desaconsejado';
    }

    return `${recommendation} (Score: ${score}). ${analysisPoints.join('. ')}.`;
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
        return 'Esta mejora en la calificación es una señal positiva';
      case 'downgrade':
        return 'Esta rebaja en la calificación indica cautela por parte del analista';
      case 'initiate':
        return 'El analista ha iniciado cobertura, proporcionando una nueva perspectiva';
      case 'maintain':
        return 'El analista mantiene su posición, confirmando su análisis previo';
      case 'reiterate':
        return 'El analista reitera su posición, reforzando su confianza en la recomendación';
      default:
        return '';
    }
  }
}
