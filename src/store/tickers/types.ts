export const SET_TICKERS = "SET_TICKERS";
export const ADD_TICKER = "ADD_TICKER";
export const REMOVE_TICKER = "REMOVE_TICKER";
export const CLEAR_TICKERS = "CLEAR_TICKERS";

export interface TickersState {
  tickers: string[];
}

export interface SetTickersAction {
  type: typeof SET_TICKERS;
  tickers: string[];
}

export interface AddTickerAction {
  type: typeof ADD_TICKER;
  ticker: string;
}

export interface RemoveTickerAction {
  type: typeof REMOVE_TICKER;
  ticker: string;
}

export interface ClearTickersAction {
  type: typeof CLEAR_TICKERS;
}

export type TickersActionTypes = SetTickersAction | AddTickerAction | RemoveTickerAction | ClearTickersAction;