import React from "react";
import "./App.css";
import MainViewComponent from "./views/MainView/MainView";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import StockDetailsViewComponent from "./views/StocksDetailsView/StockDetailsView";

export function AppComponent() {
  return (
    <Router>
      <div className="stocks-view-app">
        <Switch>
          <Route exact path="/" component={MainViewComponent} />
          <Route
            path="/stock-details/:ticker"
            component={StockDetailsViewComponent}
          />
        </Switch>
      </div>
    </Router>
  );
}
