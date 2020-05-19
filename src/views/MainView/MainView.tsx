import React, { useState, useEffect } from "react";
import { Stock } from "../../models/tinkoffTrading";
import StocksListComponent from "../../widgets/StocksList/StocksList";
import "./MainView.css";
import { useHistory } from "react-router-dom";
import TinkoffTradingApi from "../../api/TinkoffTradingApi";
import MainLayoutComponent from "../../layouts/MainLayout";

const tradingApi = new TinkoffTradingApi();

export default function MainViewComponent() {
  const history = useHistory();

  const [stocks, setStocks] = useState<Stock[]>();

  useEffect(() => {
    const updateStocks = async (): Promise<void> => {
      try {
        setStocks(await tradingApi.getStocks(["GOOGL", "MSFT", "AAPL"]));
      } catch (e) {
        console.warn(e.message);
      }
    };

    updateStocks();
  }, []);

  const handleStockSelect = (stock: Stock) => {
    history.push(`/stock-details/${stock.symbol.ticker}`);
  };

  return (
    <MainLayoutComponent title="Stocks view">
      <div className="main-view">
        <StocksListComponent stocks={stocks} onSelect={handleStockSelect} />
      </div>
    </MainLayoutComponent>
  );
}
