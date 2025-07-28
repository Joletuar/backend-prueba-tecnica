import { GetAllStocks } from '../../application/get-all-stocks/get-all-stocks.use-case';
import { GetBrokerages } from '../../application/get-brokerages/get-brokerages.use-case';
import { GetStockById } from '../../application/get-stock-by-id/get-stock-by-id.use-case';
import { CockroachDBStockRepository } from '../persistence/cockroachdb/cockroachdb-stock.repository';

export const repository = new CockroachDBStockRepository();

export const getAllStocks = new GetAllStocks(repository);
export const getBrokerages = new GetBrokerages(repository);
export const getStockById = new GetStockById(repository);
