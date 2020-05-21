import {
  StocksState,
  StocksActionTypes,
  RemoveStockAction,
  AddStockAction,
} from "./types";

const addStockReducer = (
  state: StocksState,
  action: AddStockAction
): StocksState => {
  const stocks = state.stocks ? state.stocks : [];

  if (stocks.find((stock) => stock.symbol.isin === action.stock.symbol.isin)) {
    return state;
  }

  return { ...state, stocks: [...stocks, action.stock] };
};

const removeStockReducer = (
  state: StocksState,
  action: RemoveStockAction
): StocksState => {
  const stocks = state.stocks ? state.stocks : [];

  if (!stocks.find((stock) => stock.symbol.isin === action.stock.symbol.isin)) {
    return state;
  }

  return { ...state, stocks: stocks.filter((stock) => stock !== action.stock) };
};

const initialState: StocksState = {
  stocks: undefined,
};

export const stocksReducer = (
  state = initialState,
  action: StocksActionTypes
): StocksState => {
  switch (action.type) {
    case "SET_STOCKS":
      return { ...state, stocks: action.stocks };

    case "ADD_STOCK":
      return addStockReducer(state, action);

    case "REMOVE_STOCK":
      return removeStockReducer(state, action);

    case "CLEAR_STOCKS":
      return { ...state, stocks: undefined };

    default:
      return state;
  }
};

export const mapStocksState = (state: StocksState) => ({
  stocks: state.stocks,
});
