import React from "react";
import "./App.css";
import MainViewComponent from "./views/MainView/MainView";
import { BrowserRouter as Router, Route } from "react-router-dom";
import StockDetailsViewComponent from "./views/StocksDetailsView/StockDetailsView";
import AddStockViewComponent from "./views/AddStockView/AddStockView";
// @ts-ignore
import { store } from "./store/store";
import { setTickers } from "./store/tickers/actions";
import { Switch } from "react-router-dom";

function loadTickers() {
  try {
    const tickersJson = localStorage.getItem("tickers");
    if (!tickersJson) {
      throw new Error();
    }

    const tickers = JSON.parse(tickersJson);
    store.dispatch(setTickers(tickers));
  } catch (e) {}
}

loadTickers();

export function AppComponent() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="stocks-view-app">
        <Switch>
          <Route exact path="/" component={MainViewComponent} />
          <Route
            path="/stock-details/:ticker"
            component={StockDetailsViewComponent}
          />
          <Route path="/add-stock" component={AddStockViewComponent} />
        </Switch>
      </div>
    </Router>
  );
}
