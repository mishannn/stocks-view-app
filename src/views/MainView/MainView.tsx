import React, { useEffect } from "react";
import "./MainView.css";
import TinkoffTradingApi from "../../api/TinkoffTradingApi";
import MainLayoutComponent from "../../layouts/MainLayout";
import { setStocks } from "../../store/stocks/actions";
import StocksListComponent from "../../widgets/StocksList/StocksList";
import { Stock } from "../../models/tinkoffTrading";
import { useAppStore } from "../../store/store";
// import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
// import { removeTicker } from "../../store/tickers/actions";
// import confirm from "antd/lib/modal/confirm";
// import { ExclamationCircleOutlined } from "@ant-design/icons";
import interval from "interval-promise";
import BottomButtonComponent from "../../components/BottomButton/BottomButton";

const tradingApi = new TinkoffTradingApi();

export default function MainViewComponent() {
  const history = useHistory();
  const [state, dispatch] = useAppStore();
  // const [manageModeEnabled, setManageModeEnabled] = useState(false);
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

    let intervalStopped = false;
    interval(async (_iteration, stop) => {
      if (intervalStopped) {
        stop();
        return;
      }

      return updateStocks();
    }, 5000);

    return () => {
      intervalStopped = true;
    };
  }, [dispatch, state.tickers.tickers]);

  const handleStockSelect = (stock: Stock) => {
    history.push(`/stock-details/${stock.symbol.ticker}`);
  };

  // const handleStockDelete = (stock: Stock) => {
  //   confirm({
  //     title: `Do you want to delete ${stock.symbol.showName}?`,
  //     icon: <ExclamationCircleOutlined />,
  //     centered: true,
  //     okButtonProps: {
  //       type: "primary",
  //       danger: true,
  //     },
  //     onOk() {
  //       dispatch(removeTicker(stock.symbol.ticker));
  //     },
  //     onCancel() {},
  //   });
  // };

  // const handleManageButtonClick = () => {
  //   setManageModeEnabled(!manageModeEnabled);
  // };

  return (
    <MainLayoutComponent
      title="Stocks"
      // extra={[
      //   <Button
      //     key="1"
      //     onClick={handleManageButtonClick}
      //     type={manageModeEnabled ? "primary" : "default"}
      //   >
      //     {manageModeEnabled ? "Finish" : "Manage"}
      //   </Button>,
      // ]}
    >
      <div className="main-view">
        <div className="stock-list-container">
          <StocksListComponent
            stocks={state.stocks.stocks}
            // manage={manageModeEnabled}
            onSelect={handleStockSelect}
            // onDelete={handleStockDelete}
          />
        </div>
        {/* {!manageModeEnabled && ( */}
        <Link to="/add-stock">
          <BottomButtonComponent type="primary" icon={<PlusOutlined />} block>
            Add stock
          </BottomButtonComponent>
        </Link>
        {/* )} */}
      </div>
    </MainLayoutComponent>
  );
}
