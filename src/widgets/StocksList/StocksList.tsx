import React, { useEffect } from "react";
import { List, Avatar } from "antd";
import { Stock } from "../../models/tinkoffTrading";
import "./StocksList.css";

export type SelectEventHandler = (stock: Stock) => void;

export interface StocksListProps {
  stocks: Stock[] | undefined;
  onSelect?: SelectEventHandler;
  onLongPress?: SelectEventHandler;
}

let buttonPressTimer: NodeJS.Timeout | undefined = undefined;

export default function StocksListComponent(props: StocksListProps) {
  const handleButtonPress = (stock: Stock) => {
    buttonPressTimer = setTimeout(() => props.onLongPress?.(stock), 500);
  };

  const handleButtonRelease = () => {
    if (buttonPressTimer) {
      clearTimeout(buttonPressTimer);
      buttonPressTimer = undefined;
    }
  };

  useEffect(() => {
    return () => {
      if (buttonPressTimer) {
        clearTimeout(buttonPressTimer);
        buttonPressTimer = undefined;
      }
    };
  }, []);

  const handleListItemClick = (stock: Stock) => {
    props.onSelect?.(stock);
  };

  const getPriceText = (stock: Stock) => {
    const fixedPrice = stock.price.value.toFixed(2);
    const priceCurrency = stock.price.currency;

    return `${fixedPrice} ${priceCurrency}`;
  };

  const getEarningsClassNames = (stock: Stock) => {
    const classNames = ["stock-earnings"];

    if (stock.earnings.relative === 0) {
      return classNames;
    }

    if (stock.earnings.relative > 0) {
      classNames.push("positive");
    } else {
      classNames.push("negative");
    }

    return classNames;
  };

  const getEarningsText = (stock: Stock) => {
    const earningsFixedAbsoluteValue = stock.earnings.absolute.value.toFixed(2);
    const earningsCurrency = stock.earnings.absolute.currency;
    const earningsFixedRelativeValue = Math.abs(
      stock.earnings.relative * 100
    ).toFixed(2);

    return `${earningsFixedAbsoluteValue} ${earningsCurrency} (${earningsFixedRelativeValue}%)`;
  };

  const getLogoUrl = (stock: Stock) => {
    const logoName = stock.symbol.logoName.replace(".png", "x160.png");
    return `https://static.tinkoff.ru/brands/traiding/${logoName}`;
  };

  const renderListItem = (stock: Stock): JSX.Element => {
    return (
      <List.Item
        className={["item", stock.symbol.isin].join(" ")}
        key={stock.symbol.isin}
        onClick={() => handleListItemClick(stock)}
        onTouchStart={() => handleButtonPress(stock)}
        onTouchEnd={handleButtonRelease}
        onMouseDown={() => handleButtonPress(stock)}
        onMouseUp={handleButtonRelease}
        onMouseLeave={handleButtonRelease}
        onMouseMove={handleButtonRelease}
        onTouchMove={handleButtonRelease}
      >
        <List.Item.Meta
          avatar={<Avatar src={getLogoUrl(stock)} />}
          title={stock.symbol.showName}
          description={stock.symbol.ticker}
        />
        <div className="content">
          <div className="stock-price">{getPriceText(stock)}</div>
          <div className={getEarningsClassNames(stock).join(" ")}>
            {getEarningsText(stock)}
          </div>
        </div>
      </List.Item>
    );
  };

  return (
    <List
      className="stocks-list"
      loading={!props.stocks}
      dataSource={props.stocks || []}
      renderItem={renderListItem}
    />
  );
}
