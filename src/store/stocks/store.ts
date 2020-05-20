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
  if (state.stocks.includes(action.stock)) {
    return state;
  }
  return { ...state, stocks: [...state.stocks, action.stock] };
};

const removeStockReducer = (
  state: StocksState,
  action: RemoveStockAction
): StocksState => {
  if (state.stocks.includes(action.stock)) {
    return state;
  }
  return {
    ...state,
    stocks: state.stocks.filter((stock) => stock !== action.stock),
  };
};

const initialState: StocksState = {
  stocks: [],
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
      return { ...state, stocks: [] };

    default:
      return state;
  }
};

export const mapStocksState = (state: StocksState) => ({
  stocks: state.stocks,
});
