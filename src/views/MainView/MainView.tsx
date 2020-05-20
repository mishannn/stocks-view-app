import React, { useEffect } from "react";
import "./MainView.css";
import TinkoffTradingApi from "../../api/TinkoffTradingApi";
import MainLayoutComponent from "../../layouts/MainLayout";
import { setStocks } from "../../store/stocks/actions";
import StocksListComponent from "../../widgets/StocksList/StocksList";
import { Stock } from "../../models/tinkoffTrading";
import { useAppStore } from "../../store/store";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { removeTicker } from "../../store/tickers/actions";
import confirm from "antd/lib/modal/confirm";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const tradingApi = new TinkoffTradingApi();

export default function MainViewComponent() {
  const [state, dispatch] = useAppStore();
  // const tickers = useSelector((state: RootState) => state.tickers.tickers);

  useEffect(() => {
    const updateStocks = async (): Promise<void> => {
      try {
        const stocks = await tradingApi.getStocks(state.tickers.tickers);
        dispatch(setStocks(stocks));
      } catch (e) {
        console.warn(e.message);
      }
    };

    updateStocks();
  }, [dispatch, state.tickers.tickers]);

  const handleStockSelect = (stock: Stock) => {
    // history.push(`/stock-details/${stock.symbol.ticker}`);
  };

  const handleStockLongPress = (stock: Stock) => {
    confirm({
      title: `Do you want to delete ${stock.symbol.showName}?`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      // content:
      //   "When clicked the OK button, this dialog will be closed after 1 second",
      onOk() {
        dispatch(removeTicker(stock.symbol.ticker));
      },
      onCancel() {},
    });
  };

  return (
    <MainLayoutComponent title="Stocks view">
      <div className="main-view">
        <div className="stock-list-container">
          <StocksListComponent
            stocks={state.stocks.stocks}
            onSelect={handleStockSelect}
            onLongPress={handleStockLongPress}
          />
        </div>
        <Link to="/add-stock">
          <Button
            className="add-stock-button"
            type="primary"
            icon={<PlusOutlined />}
            block
          >
            Add stock
          </Button>
        </Link>
      </div>
    </MainLayoutComponent>
  );
}
