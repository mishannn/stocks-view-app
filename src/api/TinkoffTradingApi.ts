import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Stock,
  Response,
  StocksList,
  Candle,
  CandlesList,
  PulsePost,
  PulsePostList,
  PulseCommentList,
  PulseComment,
} from "../models/tinkoffTrading";
import { subDays, formatISO, isWeekend, lastDayOfWeek, sub } from "date-fns";

const BASE_URL = "https://api.tinkoff.ru/trading";
const PULSE_BASE_URL = "https://api-invest-gw.tinkoff.ru/social/v1";

export enum RequestMethod {
  GetStocks = "stocks/list",
  GetStock = "stocks/get",
  GetCandles = "symbols/candles",
}

export default class TinkoffTradingApi {
  private client!: AxiosInstance;
  private pulseClient!: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
    });

    this.pulseClient = axios.create({
      baseURL: PULSE_BASE_URL,
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
    const dateNow = new Date();
    const todayIsWeekend = isWeekend(dateNow);

    const dateTo = todayIsWeekend
      ? sub(lastDayOfWeek(dateNow, { weekStartsOn: 1 }), {
          hours: 22,
          minutes: 15,
        })
      : dateNow;
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

  async getPulsePosts(ticker: string, limit = 50): Promise<PulsePost[]> {
    const postList = await this.requestPulseMethod<PulsePostList>(
      `post/instrument/${ticker}`,
      {
        limit,
      }
    );

    return postList.items;
  }

  async getPulseComments(postId: string): Promise<PulseComment[]> {
    const commentList = await this.requestPulseMethod<PulseCommentList>(
      `post/${postId}/comment`,
      {}
    );

    return commentList.items;
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

  private async requestPulseMethod<T>(path: string, params: any): Promise<T> {
    const response: AxiosResponse<Response<T>> = await this.pulseClient.get(
      path,
      {
        params,
      }
    );

    const payload = response.data.payload;

    if ("code" in payload && "message" in payload) {
      throw new Error(payload.message);
    }

    return payload;
  }
}
