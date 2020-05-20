import {
  TickersState,
  TickersActionTypes,
  RemoveTickerAction,
  AddTickerAction,
} from "./types";

const addTickerReducer = (
  state: TickersState,
  action: AddTickerAction
): TickersState => {
  if (state.tickers.includes(action.ticker)) {
    return state;
  }

  const tickers = [...state.tickers, action.ticker];
  localStorage.setItem("tickers", JSON.stringify(tickers));

  return { ...state, tickers };
};

const removeTickerReducer = (
  state: TickersState,
  action: RemoveTickerAction
): TickersState => {
  if (!state.tickers.includes(action.ticker)) {
    return state;
  }

  const tickers = state.tickers.filter((ticker) => ticker !== action.ticker);
  localStorage.setItem("tickers", JSON.stringify(tickers));

  return {
    ...state,
    tickers,
  };
};

const initialState: TickersState = {
  tickers: [
    "V",
    "ADBE",
    "AAPL",
    "INTC",
    "FB",
    "AMD",
    "GOOGL",
    "GOOG",
    "NVDA",
    "MSFT",
    "MA",
  ],
};

export const tickersReducer = (
  state = initialState,
  action: TickersActionTypes
): TickersState => {
  switch (action.type) {
    case "SET_TICKERS":
      localStorage.setItem("tickers", JSON.stringify(action.tickers));
      return { ...state, tickers: action.tickers };

    case "ADD_TICKER":
      return addTickerReducer(state, action);

    case "REMOVE_TICKER":
      return removeTickerReducer(state, action);

    case "CLEAR_TICKERS":
      localStorage.setItem("tickers", "[]");
      return { ...state, tickers: [] };

    default:
      return state;
  }
};

export const mapTickersState = (state: TickersState) => ({
  tickers: state.tickers,
});
