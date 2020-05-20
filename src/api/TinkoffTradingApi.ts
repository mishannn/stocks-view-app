import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Stock,
  Response,
  StocksList,
  Candle,
  CandlesList,
} from "../models/tinkoffTrading";
import { subDays, formatISO } from "date-fns";

const BASE_URL = "https://api.tinkoff.ru/trading";

export enum RequestMethod {
  GetStocks = "stocks/list",
  GetStock = "stocks/get",
  GetCandles = "symbols/candles",
}

export default class TinkoffTradingApi {
  private client!: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
    });
  }

  async getStocks(tickers?: string[]): Promise<Stock[]> {
    const params: any = {
      tickers,
      country: "All",
      orderType: "Desc",
      sortType: "ByEarnings",
    };

    if (tickers) {
      params.tickers = tickers;
    }

    const stocksList = await this.requestMethod<StocksList>(
      RequestMethod.GetStocks,
      params
    );

    return stocksList.values;
  }

  async searchStocks(query?: string, amount = 20): Promise<Stock[]> {
    const params: any = {
      country: "All",
      orderType: "Desc",
      sortType: "ByEarnings",
      start: 0,
      end: amount,
    };

    if (query) {
      params.filter = query;
    }

    const stocksList = await this.requestMethod<StocksList>(
      RequestMethod.GetStocks,
      params
    );

    return stocksList.values;
  }

  async getStock(ticker: string): Promise<Stock> {
    return this.requestMethod(RequestMethod.GetStock, { ticker });
  }

  async getCandles(ticker: string): Promise<Candle[]> {
    const dateTo = new Date();
    const dateFrom = subDays(dateTo, 1);

    const candles = await this.requestMethod<CandlesList>(
      RequestMethod.GetCandles,
      {
        from: formatISO(dateFrom),
        to: formatISO(dateTo),
        resolution: 5,
        ticker,
      }
    );

    return candles.candles;
  }

  private async requestMethod<T>(
    method: RequestMethod,
    params: any
  ): Promise<T> {
    const response: AxiosResponse<Response<T>> = await this.client.post(
      method,
      params
    );

    const payload = response.data.payload;

    if ("code" in payload && "message" in payload) {
      throw new Error(payload.message);
    }

    return payload;
  }
}
