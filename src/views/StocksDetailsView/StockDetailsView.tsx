import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./StockDetailsView.css";
import { Stock, Candle } from "../../models/tinkoffTrading";
import TinkoffTradingApi from "../../api/TinkoffTradingApi";
import MainLayoutComponent from "../../layouts/MainLayout";
// @ts-ignore
import F2 from "@antv/f2/lib/index-all";
import { format, fromUnixTime } from "date-fns";
import interval from "interval-promise";
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

    // let intervalStopped = false;
    // interval(async (_iteration, stop) => {
    //   if (intervalStopped) {
    //     stop();
    //     return;
    //   }

    //   return updateStock();
    // }, 2500);

    // return () => {
    //   intervalStopped = true;
    // };
  }, [tickerRef]);

  useEffect(() => {
    if (!candles || !stock) return;

    // const data = {
    //   labels: candles.map((candle) =>
    //     format(fromUnixTime(candle.date), "HH:mm")
    //   ),
    //   datasets: [
    //     {
    //       name: "Price",
    //       type: "bar",
    //       values: candles?.map((candle) => candle.c),
    //     },
    //   ],
    // };

    // new Chart("#chart", {
    //   data: data,
    //   type: "bar",
    //   height: 250,
    //   colors: ["#1890ff"],
    // });

    const chart = new F2.Chart({
      id: "chart",
      pixelRatio: window.devicePixelRatio,
      // padding: ['auto', 0, 0, 'auto'],
      // appendPadding: [15, 0, 0, 15],
    });

    const data = candles.map((candle, index) => ({
      index,
      date: candle.date,
      price: candle.c,
    }));

    // const dateMax = data[data.length - 1].date;
    // const dateMin = dateMax - 24 * 3600;

    chart.source(data, {
      price: {
        formatter: (val: number) => {
          return val.toFixed(2);
        },
      },
    });
    chart.tooltip({
      showCrosshairs: true,
      showItemMarker: false,
      background: {
        radius: 2,
        fill: "#1890FF",
        padding: [3, 5],
      },
      nameStyle: {
        fill: "#fff",
      },
      onShow: (ev: any) => {
        const items = ev.items;
        console.log(items);
        items[0].name = format(
          fromUnixTime(items[0].origin.date),
          "HH:mm MM/dd"
        );
        items[0].value = `${items[0].value} ${getCurrencySymbol(
          stock.price.currency
        )}`;
      },
    });
    chart.area().position("index*price");
    chart.line().position("index*price");
    chart.axis("index", false);

    chart.interaction("pan");
    // chart.scrollBar({
    //   mode: "x",
    //   xStyle: {
    //     offsetY: -5,
    //   },
    // });

    chart.guide().tag({
      position: [1969, 1344],
      withPoint: false,
      content: "1,344",
      limitInPlot: true,
      offsetX: 5,
      direct: "cr",
    });
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

  return (
    <MainLayoutComponent
      title={stock?.symbol.showName}
      subtitle={stock?.symbol.ticker}
    >
      <div className="stock-details-view">
        <div className="details-container">
          {candles && stock && (
            <div className="details">
              <canvas className="chart-canvas" id="chart" />
              <div className="details-price">
                {candles[candles.length - 1].c}{" "}
                {getCurrencySymbol(stock.price.currency)}
              </div>
            </div>
          )}
        </div>
        {getStockActionButton()}
      </div>
    </MainLayoutComponent>
  );
}
