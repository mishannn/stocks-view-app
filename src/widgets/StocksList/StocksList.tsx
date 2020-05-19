import React from "react";
import { List, Avatar } from "antd";
import { Stock } from "../../models/tinkoffTrading";
import "./StocksList.css";

export type SelectEventHandler = (stock: Stock) => void;

export interface StocksListProps {
  stocks: Stock[] | undefined;
  onSelect?: SelectEventHandler;
}

export default function StocksListComponent(props: StocksListProps) {
  const handleListItemClick = (stock: Stock) => {
    props.onSelect?.(stock);
  };

  const renderListItem = (stock: Stock): JSX.Element => {
    return (
      <List.Item
        onClick={() => handleListItemClick(stock)}
        className={`item`}
        key={stock.symbol.isin}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={`https://static.tinkoff.ru/brands/traiding/${stock.symbol.isin}x160.png`}
            />
          }
          title={stock.symbol.showName}
          description={stock.symbol.ticker}
        />
        <div>
          {stock.price.value} {stock.price.currency}
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
