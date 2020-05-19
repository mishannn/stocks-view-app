import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./StockDetailsView.css";
import { Stock, Candle } from "../../models/tinkoffTrading";
import TinkoffTradingApi from "../../api/TinkoffTradingApi";
import MainLayoutComponent from "../../layouts/MainLayout";
import { Line } from "react-chartjs-2";
import { format, fromUnixTime } from "date-fns";

const tradingApi = new TinkoffTradingApi();

export interface StockDetailsViewRouteParams {
  ticker: string;
}

export default function StockDetailsViewComponent() {
  const history = useHistory();
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
        setStock(await tradingApi.getStock(ticker));
        setCandles(await tradingApi.getCandles(ticker));
      } catch (e) {
        console.warn(e.message);
      }
    };

    updateStock();
  }, [tickerRef]);

  const getChartData = () => ({
    labels:
      candles?.map((candle) =>
        format(fromUnixTime(candle.date), "HH:mm MM/dd")
      ) || [],
    datasets: [
      {
        label: "Candles",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: candles?.map((candle) => candle.c) || [],
      },
    ],
  });

  const chartOptions = {
    scales: {
      // xAxes: [
      //   {
      //     ticks: {
      //       display: false,
      //     },
      //   },
      // ],
      yAxes: [
        {
          ticks: {
            display: false,
          },
        },
      ],
    },
  };

  const candlesChart = (
    <div className="chart-container">
      <Line data={getChartData()} options={chartOptions} width={4000} height={400} />
    </div>
  );

  return (
    <MainLayoutComponent
      title={stock?.symbol.showName}
      subtitle={stock?.symbol.ticker}
      onBack={() => history.goBack()}
    >
      <div className="stock-details-view">{candles && candlesChart}</div>
    </MainLayoutComponent>
  );
}
