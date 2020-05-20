import React, { useState, useEffect } from "react";
import "./AddStockView.css";
import MainLayoutComponent from "../../layouts/MainLayout";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TinkoffTradingApi from "../../api/TinkoffTradingApi";
import { Stock } from "../../models/tinkoffTrading";
import StocksListComponent from "../../widgets/StocksList/StocksList";
import { useHistory } from "react-router-dom";
import { useAppStore } from "../../store/store";
import { addTicker } from "../../store/tickers/actions";

const tradingApi = new TinkoffTradingApi();

function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export default function AddStockViewComponent() {
  const history = useHistory();
  const [query, setQuery] = useState<string>();
  const [stocks, setStocks] = useState<Stock[]>();
  const debouncedQuery = useDebounce(query, 200);
  const [, dispatch] = useAppStore();

  useEffect(() => {
    const updateStocks = async (): Promise<void> => {
      try {
        const stocks = await tradingApi.searchStocks(debouncedQuery);
        setStocks(stocks);
      } catch (e) {
        console.warn(e.message);
      }
    };

    updateStocks();

    return () => {
      setStocks(undefined);
    };
  }, [debouncedQuery]);

  const handleStockSelect = (stock: Stock) => {
    dispatch(addTicker(stock.symbol.ticker));
    history.push("/");
  };

  return (
    <MainLayoutComponent title="Add new stock">
      <div className="add-stock-view">
        <div className="search-container">
          <Input
            size="large"
            placeholder="Enter stock ticker or name"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            prefix={<SearchOutlined />}
          />
        </div>
        <div className="stocks-list-container">
          <StocksListComponent stocks={stocks} onSelect={handleStockSelect} />
        </div>
      </div>
    </MainLayoutComponent>
  );
}
