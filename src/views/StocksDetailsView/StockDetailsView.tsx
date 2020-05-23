import React, { useEffect, useState, useRef, createRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./StockDetailsView.css";
import {
  Stock,
  Candle,
  PulsePost,
  PulseComment,
} from "../../models/tinkoffTrading";
import TinkoffTradingApi from "../../api/TinkoffTradingApi";
import MainLayoutComponent from "../../layouts/MainLayout";
// @ts-ignore
import F2 from "@antv/f2/lib/index-all";
import { fromUnixTime, formatDistanceToNow, parseISO } from "date-fns";
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
import { Spin, Comment, Avatar, Empty } from "antd";
import LetterAvatar from "react-avatar";
import { LikeFilled } from "@ant-design/icons";
// @ts-ignore
import ReadMoreReact from "read-more-react";

const tradingApi = new TinkoffTradingApi();

export interface StockDetailsViewRouteParams {
  ticker: string;
}

export default function StockDetailsViewComponent() {
  const history = useHistory();
  const [state, dispatch] = useAppStore();
  const params = useParams<StockDetailsViewRouteParams>();
  const chartRef = createRef<HTMLCanvasElement>();
  const tickerRef = useRef<string>();
  const [stock, setStock] = useState<Stock>();
  const [candles, setCandles] = useState<Candle[]>();
  const [posts, setPosts] = useState<PulsePost[]>();
  const [comments, setComments] = useState<{
    [postId: string]: PulseComment[];
  }>();

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

    const updatePosts = async () => {
      const ticker = tickerRef.current;
      if (!ticker) return;

      try {
        const posts = await tradingApi.getPulsePosts(ticker);

        const postsComments = await Promise.all(
          posts.map((post) => {
            return tradingApi.getPulseComments(post.id);
          })
        );

        const allComments = postsComments.reduce((acc, postComments, index) => {
          const postId = posts[index].id;
          return { ...acc, [postId]: postComments };
        }, {});

        setPosts(posts);
        setComments(allComments);
      } catch (e) {
        console.warn(e.message);
      }
    };

    updateStock();
    updateCandles();
    updatePosts();
  }, [tickerRef]);

  useEffect(() => {
    if (!stock || !candles || !candles.length) return;

    const chartEl = chartRef.current;
    if (!chartEl) return;

    const chart = new F2.Chart({
      el: chartEl,
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
  }, [chartRef, candles, stock]);

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

  const getPostOrCommentAvatar = (post: PulsePost | PulseComment) => {
    if (!post.image) {
      return (
        <LetterAvatar
          name={post.nickname}
          color="#1890FF"
          size="32"
          round={true}
        />
      );
    }

    const avatarUrl = `https://api-invest-gw.tinkoff.ru/social/file/v1/cache/profile/avatar/${post.image}?size=small`;
    return <Avatar src={avatarUrl} alt={post.nickname} />;
  };

  const getComments = (post: PulsePost) => {
    const postComments = comments?.[post.id];
    if (!postComments) {
      return undefined;
    }

    return postComments.map((comment) => {
      return (
        <Comment
          className="comment"
          key={comment.id}
          author={comment.nickname}
          avatar={getPostOrCommentAvatar(comment)}
          content={
            <ReadMoreReact text={comment.text.replace(/\{(.*?)\}/g, "$1")} />
          }
          datetime={formatDistanceToNow(parseISO(comment.inserted), {
            addSuffix: true,
          })}
          actions={[
            <div className="comment-likes">
              <LikeFilled className="like-icon" />
              {comment.likesCount}
            </div>,
          ]}
        />
      );
    });
    // comments?.[post.id]
  };

  const getPosts = () => {
    if (!posts) {
      return undefined;
    }

    return posts.map((post) => {
      return (
        <Comment
          className="comment"
          key={post.id}
          author={post.nickname}
          avatar={getPostOrCommentAvatar(post)}
          content={
            <ReadMoreReact text={post.text.replace(/\{\$(.*?)\}/g, "$1")} />
          }
          datetime={formatDistanceToNow(parseISO(post.inserted), {
            addSuffix: true,
          })}
          actions={[
            <div className="comment-likes">
              <LikeFilled className="like-icon" />
              {post.likesCount}
            </div>,
          ]}
        >
          {getComments(post)}
        </Comment>
      );
    });
  };

  const getChart = () => {
    if (!stock || !candles || !candles.length) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return <canvas className="chart-canvas" ref={chartRef} />;
  };

  const getStockPriceText = () => {
    if (!stock || !candles || !candles.length) return;

    const lastPrice = candles[candles.length - 1].c;
    const currencySymbol = getCurrencySymbol(stock.price.currency);
    return `${lastPrice} ${currencySymbol}`;
  };

  const getDetails = () => {
    if (!candles || !stock || !posts) {
      return (
        <div className="spin-container">
          <Spin />
        </div>
      );
    }

    return (
      <div className="details">
        {getChart()}
        <div className="details-price">{getStockPriceText()}</div>
        <div className="details-posts">{getPosts()}</div>
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
