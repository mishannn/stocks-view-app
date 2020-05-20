import React, { useEffect, useState } from "react";
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
  const [manageModeEnabled, setManageModeEnabled] = useState(false);
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

  const handleStockDelete = (stock: Stock) => {
    confirm({
      title: `Do you want to delete ${stock.symbol.showName}?`,
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      onOk() {
        dispatch(removeTicker(stock.symbol.ticker));
      },
      onCancel() {},
    });
  };

  const handleManageButtonClick = () => {
    setManageModeEnabled(!manageModeEnabled);
  };

  return (
    <MainLayoutComponent
      title="Stocks view"
      extra={[
        <Button
          onClick={handleManageButtonClick}
          type={manageModeEnabled ? "primary" : "default"}
        >
          {manageModeEnabled ? "Finish" : "Manage"}
        </Button>,
      ]}
    >
      <div className="main-view">
        <div className="stock-list-container">
          <StocksListComponent
            stocks={state.stocks.stocks}
            manage={manageModeEnabled}
            onSelect={handleStockSelect}
            onDelete={handleStockDelete}
          />
        </div>
        {!manageModeEnabled && (
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
        )}
      </div>
    </MainLayoutComponent>
  );
}
