import { stocksReducer } from "./stocks/store";
import { tickersReducer } from "./tickers/store";
import { combineReducers, createStore } from "redux";
import { useDispatch, useSelector } from "react-redux";

export const rootReducer = combineReducers({
  stocks: stocksReducer,
  tickers: tickersReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = () => useSelector((state: RootState) => state);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppStore = (): [RootState, AppDispatch] => [useAppSelector(), useAppDispatch()];
