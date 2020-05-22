import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./StockDetailsView.css";
import { Stock, Candle } from "../../models/tinkoffTrading";
import TinkoffTradingApi from "../../api/TinkoffTradingApi";
import MainLayoutComponent from "../../layouts/MainLayout";
// @ts-ignore
import F2 from "@antv/f2/lib/index-all";
import { fromUnixTime } from "date-fns";
import getCurrencySymbol from "../../utils/getCurrencySymbol";
import BottomButtonComponent from "../../components/BottomButton/BottomButton";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import { removeTicker, addTicker } from "../../store/tickers/actions";
import { useAppStore } from "../../store/store";
import { Spin } from "antd";

const tradingApi = new TinkoffTradingApi();

export interface StockDetailsViewRouteParams {
  ticker: string;
}

export default function StockDetailsViewComponent() {
  const history = useHistory();
  const [state, dispatch] = useAppStore();
  const params = useParams<StockDetailsViewRouteParams>();
  const tickerRef = useRef<string>();
  const [stock, setStock] = useState<Stock>();
  const [candles, setCandles] = useState<Candle[]>();

  useEffect(() => {
    tickerRef.current = params.ticker;
  });

  useEffect(() => {
    const updateStock = async () => {
      const ticker = tickerRef.current;
      if (!ticker) return;

      try {
        const stock = await tradingApi.getStock(ticker);
        setStock(stock);
      } catch (e) {
        console.warn(e.message);
      }
    };

    const updateCandles = async () => {
      const ticker = tickerRef.current;
      if (!ticker) return;

      try {
        const candles = await tradingApi.getCandles(ticker);
        setCandles(candles);
      } catch (e) {
        console.warn(e.message);
      }
    };

    updateStock();
    updateCandles();
  }, [tickerRef]);

  useEffect(() => {
    if (!candles || !stock) return;

    const chart = new F2.Chart({
      id: "chart",
      pixelRatio: window.devicePixelRatio,
    });

    const data = candles.map((candle) => ({
      date: fromUnixTime(candle.date),
      price: candle.c,
    }));

    chart.source(data, {
      date: {
        type: "timeCat",
        mask: "HH:mm",
        values: data.slice(-96).map((item) => item.date),
      },
      price: {
        formatter: (val: number) => {
          return `${val.toFixed(2)} ${getCurrencySymbol(stock.price.currency)}`;
        },
      },
    });

    chart.tooltip({
      showCrosshairs: true,
      showItemMarker: false,
      background: {
        radius: 2,
        fill: "#1890FF",
        // padding: [3, 5],
      },
      nameStyle: {
        fill: "#fff",
      },
      onShow: (ev: any) => {
        const items = ev.items;
        // console.log(items);
        items[0].name = items[0].title;
      },
    });

    chart.scrollBar({
      mode: "x",
      xStyle: {
        offsetY: -5,
      },
    });

    chart.area().position("date*price").shape("smooth");
    chart.line().position("date*price").shape("smooth");

    chart.interaction("pan");
    chart.render();
  }, [candles, stock]);

  const handleRemoveButtonClick = () => {
    confirm({
      title: `Do you want to delete ${
        stock?.symbol.showName || params.ticker
      }?`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      onOk() {
        dispatch(removeTicker(params.ticker));
        history.push("/");
      },
      onCancel() {},
    });
  };

  const handleAddButtonClick = () => {
    dispatch(addTicker(params.ticker));
    history.push("/");
  };

  const isStockAdded = () => {
    return state.tickers.tickers.includes(params.ticker);
  };

  const getStockActionButton = () => {
    if (isStockAdded()) {
      return (
        <BottomButtonComponent
          type="primary"
          danger
          icon={<DeleteOutlined />}
          block
          onClick={handleRemoveButtonClick}
        >
          Remove
        </BottomButtonComponent>
      );
    }

    return (
      <BottomButtonComponent
        type="primary"
        icon={<PlusOutlined />}
        block
        onClick={handleAddButtonClick}
      >
        Add
      </BottomButtonComponent>
    );
  };

  const getDetails = () => {
    if (!candles || !stock) {
      return (
        <div className="spin-container">
          <Spin />
        </div>
      );
    }

    return (
      <div className="details">
        <canvas className="chart-canvas" id="chart" />
        <div className="details-price">
          {candles[candles.length - 1].c}{" "}
          {getCurrencySymbol(stock.price.currency)}
        </div>
      </div>
    );
  };

  return (
    <MainLayoutComponent
      title={stock?.symbol.showName}
      subtitle={stock?.symbol.ticker}
    >
      <div className="stock-details-view">
        <div className="details-container">{getDetails()}</div>
        {getStockActionButton()}
      </div>
    </MainLayoutComponent>
  );
}
