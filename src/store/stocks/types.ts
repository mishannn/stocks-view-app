import { Stock } from "../../models/tinkoffTrading";

export interface StocksState {
  stocks: Stock[];
}

export const SET_STOCKS = "SET_STOCKS";
export const ADD_STOCK = "ADD_STOCK";
export const REMOVE_STOCK = "REMOVE_STOCK";
export const CLEAR_STOCKS = "CLEAR_STOCKS";

export interface SetStocksAction {
  type: typeof SET_STOCKS;
  stocks: Stock[];
}

export interface AddStockAction {
  type: typeof ADD_STOCK;
  stock: Stock;
}

export interface RemoveStockAction {
  type: typeof REMOVE_STOCK;
  stock: Stock;
}

export interface ClearStocksAction {
  type: typeof CLEAR_STOCKS;
}

export type StocksActionTypes = SetStocksAction | AddStockAction | RemoveStockAction | ClearStocksAction;