import React, { useEffect } from "react";
import "./App.css";
import MainViewComponent from "./views/MainView/MainView";
import { BrowserRouter as Router, Route } from "react-router-dom";
import StockDetailsViewComponent from "./views/StocksDetailsView/StockDetailsView";
import AddStockViewComponent from "./views/AddStockView/AddStockView";
// @ts-ignore
import { AnimatedSwitch, spring } from "react-router-transition";
import { useAppStore, store } from "./store/store";
import { setTickers } from "./store/tickers/actions";
import { Switch } from "react-router-dom";

// we need to map the `scale` prop we define below
// to the transform style property
function mapStyles(styles: any) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

// wrap the `spring` helper to use a bouncy config
function bounce(val: any) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

// child matches will...
const bounceTransition = {
  // start in a transparent, upscaled state
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  // leave in a transparent, downscaled state
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8),
  },
  // and rest at an opaque, normally-scaled state
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

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
          {/* <AnimatedSwitch
          atEnter={bounceTransition.atEnter}
          atLeave={bounceTransition.atLeave}
          atActive={bounceTransition.atActive}
          mapStyles={mapStyles}
          className="route-wrapper"
        > */}
          <Route exact path="/" component={MainViewComponent} />
          <Route
            path="/stock-details/:ticker"
            component={StockDetailsViewComponent}
          />
          <Route path="/add-stock" component={AddStockViewComponent} />
          {/* </AnimatedSwitch> */}
        </Switch>
      </div>
    </Router>
  );
}
