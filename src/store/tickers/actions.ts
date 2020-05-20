import {
  AddTickerAction,
  ADD_TICKER,
  RemoveTickerAction,
  REMOVE_TICKER,
  SET_TICKERS,
  SetTickersAction,
  ClearTickersAction,
  CLEAR_TICKERS,
} from "./types";

export const setTickers = (tickers: string[]): SetTickersAction => ({
  type: SET_TICKERS,
  tickers,
});

export const addTicker = (ticker: string): AddTickerAction => ({
  type: ADD_TICKER,
  ticker,
});

export const removeTicker = (ticker: string): RemoveTickerAction => ({
  type: REMOVE_TICKER,
  ticker,
});

export const clearTickers = (): ClearTickersAction => ({
  type: CLEAR_TICKERS,
});

export const mapTickersDispatch = {
  setTickers,
  addTicker,
  removeTicker,
  clearTickers,
};
