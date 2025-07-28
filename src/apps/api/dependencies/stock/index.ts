import {
  getAllStocks,
  getBrokerages,
  getStockById,
} from '../../../../modules/stock/infraestructure/dependencies';
import { StockController } from '../../http/rest-api/controllers/stock.controller';
import { StockRoute } from '../../http/rest-api/routes/stock.route';

const controller = new StockController(
  getAllStocks,
  getBrokerages,
  getStockById
);
export const stockRoute = new StockRoute(controller);
