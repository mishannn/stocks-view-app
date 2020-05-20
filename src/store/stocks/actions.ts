import {
  AddStockAction,
  SetStocksAction,
  RemoveStockAction,
  ClearStocksAction,
  REMOVE_STOCK,
  ADD_STOCK,
  SET_STOCKS,
  CLEAR_STOCKS,
} from "./types";
import { Stock } from "../../models/tinkoffTrading";

export const setStocks = (stocks: Stock[]): SetStocksAction => ({
  type: SET_STOCKS,
  stocks,
});

export const addStock = (stock: Stock): AddStockAction => ({
  type: ADD_STOCK,
  stock,
});

export const removeStock = (stock: Stock): RemoveStockAction => ({
  type: REMOVE_STOCK,
  stock,
});

export const clearStocks = (): ClearStocksAction => ({
  type: CLEAR_STOCKS,
});

export const mapStocksDispatch = {
  setStocks,
  addStock,
  removeStock,
  clearStocks,
};