export interface StockSymbol {
  ticker: string;
  symbolType: string;
  classCode: string;
  bcsClassCode: string;
  isin: string;
  currency: string;
  lotSize: number;
  minPriceIncrement: number;
  exchange: string;
  exchangeShowName: string;
  exchangeLogoUrl: string;
  timeZone?: string;
  sessionOpen: string;
  sessionClose: string;
  description?: string;
  showName: string;
  logoName: string;
  color: string;
  textColor: string;
  sector: string;
  countryOfRiskBriefName: string;
  countryOfRiskLogoUrl: string;
  fullDescription?: string;
  brand: string;
  blackout: boolean;
  noTrade: boolean;
  premarketStartTime: string;
  premarketEndTime: string;
  marketStartTime: string;
  marketEndTime: string;
  brokerAccountTypesList: string[];
  timeToOpen: number;
  isOTC: boolean;
  bbGlobal?: string;
  shortIsEnabled: boolean;
  longIsEnabled: boolean;
}

export interface StockPrice {
  currency: string;
  value: number;
  fromCache: boolean;
}

export interface StockPrices {
  buy: StockPrice;
  sell: StockPrice;
  last: StockPrice;
  close: StockPrice;
}

export interface StockAbsoluteEarning {
  currency: string;
  value: number;
}

export interface StockEarnings {
  absolute: StockAbsoluteEarning;
  relative: number;
}

export interface StockHistoricalPrice {
  amount: number;
  time: string;
  unixtime: number;
  earningsInfo: StockEarnings;
}

export interface StockContentMarker {
  news: boolean;
  ideas: boolean;
  dividends: boolean;
  prognosis: boolean;
  events: boolean;
  fundamentals: boolean;
  recalibration: boolean;
  coupons: boolean;
}

export interface Stock {
  symbol: StockSymbol;
  prices: StockPrices;
  price: StockPrice;
  lotPrice: StockPrice;
  earnings: StockEarnings;
  exchangeStatus: string;
  instrumentStatus: string;
  historyStartDate?: string;
  historicalPrices: StockHistoricalPrice[];
  contentMarker: StockContentMarker;
  isFavorite: boolean;
  riskCategory: number;
  availableOrders?: string[];
  limitUp?: number;
  limitDown?: number;
  minPriceIncrement?: number;
  profitable: boolean;
  reliable: boolean;
  rate: number;
}

export interface StocksList {
  values: Stock[];
  total: number;
}

export interface Candle {
  o: number;
  c: number;
  h: number;
  l: number;
  v: number;
  date: number;
}

export interface CandlesList {
  candles: Candle[];
}

export interface Error {
  message: string;
  code: string;
  info?: any;
}

export interface Response<T> {
  payload: T | Error;
  trackingId: string;
  time: string;
  status: string;
}
