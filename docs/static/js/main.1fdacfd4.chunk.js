(this["webpackJsonpstocks-view"]=this["webpackJsonpstocks-view"]||[]).push([[0],{146:function(e,t,n){e.exports=n(337)},151:function(e,t,n){},153:function(e,t,n){},218:function(e,t,n){},235:function(e,t,n){},244:function(e,t,n){},336:function(e,t,n){},337:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(11),s=n.n(c),o=(n(151),n(14)),i=n.n(o),u=n(29),l=n(50),d=n(343),p=n(129);n(153);function f(e){var t=function(e){var t=["stock-earnings"];return 0===e.earnings.relative||(e.earnings.relative>0?t.push("positive"):t.push("negative")),t};return r.a.createElement(d.b,{className:"stocks-list",loading:!e.stocks,dataSource:e.stocks||[],renderItem:function(n){return r.a.createElement(d.b.Item,{onClick:function(){return function(t){var n;null===(n=e.onSelect)||void 0===n||n.call(e,t)}(n)},className:"item",key:n.symbol.isin},r.a.createElement(d.b.Item.Meta,{avatar:r.a.createElement(p.a,{src:"https://static.tinkoff.ru/brands/traiding/".concat(n.symbol.isin,"x160.png")}),title:n.symbol.showName,description:n.symbol.ticker}),r.a.createElement("div",{className:"content"},r.a.createElement("div",{className:"stock-price"},function(e){var t=e.price.value,n=e.price.currency;return"".concat(t," ").concat(n)}(n)),r.a.createElement("div",{className:t(n).join(" ")},function(e){var t=e.earnings.absolute.value.toFixed(2),n=e.earnings.absolute.currency,a=Math.abs(100*e.earnings.relative).toFixed(2);return"".concat(t," ").concat(n," (").concat(a,"%)")}(n))))}})}n(218);var v,m=n(130),b=n(131),k=n(132),h=n.n(k),g=n(344),y=n(339);!function(e){e.GetStocks="stocks/list",e.GetStock="stocks/get",e.GetCandles="symbols/candles"}(v||(v={}));var E=function(){function e(){Object(m.a)(this,e),this.client=void 0,this.client=h.a.create({baseURL:"https://api.tinkoff.ru/trading"})}return Object(b.a)(e,[{key:"getStocks",value:function(){var e=Object(u.a)(i.a.mark((function e(t){var n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.requestMethod(v.GetStocks,{tickers:t,country:"All",orderType:"Desc",sortType:"ByPrice"});case 2:return n=e.sent,e.abrupt("return",n.values);case 4:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getStock",value:function(){var e=Object(u.a)(i.a.mark((function e(t){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.requestMethod(v.GetStock,{ticker:t}));case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getCandles",value:function(){var e=Object(u.a)(i.a.mark((function e(t){var n,a,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=new Date,a=Object(g.a)(n,1),e.next=4,this.requestMethod(v.GetCandles,{from:Object(y.a)(a),to:Object(y.a)(n),resolution:5,ticker:t});case 4:return r=e.sent,e.abrupt("return",r.candles);case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"requestMethod",value:function(){var e=Object(u.a)(i.a.mark((function e(t,n){var a,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.client.post(t,n);case 2:if(a=e.sent,!("code"in(r=a.data.payload))||!("message"in r)){e.next=6;break}throw new Error(r.message);case 6:return e.abrupt("return",r);case 7:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()}]),e}(),w=n(341);n(235);function O(e){var t=r.a.createElement("div",{className:"title-skeleton"});return r.a.createElement("div",{className:"main-layout"},r.a.createElement(w.a,{className:"header",onBack:e.onBack,title:e.title||t,subTitle:e.subtitle}),r.a.createElement("div",{className:"body"},e.children))}var j=new E;function x(){var e=Object(a.useState)(),t=Object(l.a)(e,2),n=t[0],c=t[1];Object(a.useEffect)((function(){(function(){var e=Object(u.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.t0=c,e.next=4,j.getStocks(["V","ADBE","AAPL","INTC","FB","AMD","GOOGL","GOOG","NVDA","MSFT","MA","EGHT"]);case 4:e.t1=e.sent,(0,e.t0)(e.t1),e.next=11;break;case 8:e.prev=8,e.t2=e.catch(0),console.warn(e.t2.message);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(){return e.apply(this,arguments)}})()()}),[]);return r.a.createElement(O,{title:"Stocks view"},r.a.createElement("div",{className:"main-view"},r.a.createElement(f,{stocks:n,onSelect:function(e){}})))}var S=n(81),N=n(12),B=(n(244),n(139)),C=n(342),M=n(340),G=new E;function A(){var e=Object(N.f)(),t=Object(N.g)(),n=Object(a.useRef)(),c=Object(a.useState)(),s=Object(l.a)(c,2),o=s[0],d=s[1],p=Object(a.useState)(),f=Object(l.a)(p,2),v=f[0],m=f[1];Object(a.useEffect)((function(){n.current=t.ticker})),Object(a.useEffect)((function(){(function(){var e=Object(u.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=n.current){e.next=3;break}return e.abrupt("return");case 3:return e.prev=3,e.t0=d,e.next=7,G.getStock(t);case 7:return e.t1=e.sent,(0,e.t0)(e.t1),e.t2=m,e.next=12,G.getCandles(t);case 12:e.t3=e.sent,(0,e.t2)(e.t3),e.next=19;break;case 16:e.prev=16,e.t4=e.catch(3),console.warn(e.t4.message);case 19:case"end":return e.stop()}}),e,null,[[3,16]])})));return function(){return e.apply(this,arguments)}})()()}),[n]);var b=r.a.createElement("div",{className:"chart-container"},r.a.createElement(B.a,{data:{labels:(null===v||void 0===v?void 0:v.map((function(e){return Object(C.a)(Object(M.a)(e.date),"HH:mm MM/dd")})))||[],datasets:[{label:"Candles",fill:!1,lineTension:.1,backgroundColor:"rgba(75,192,192,0.4)",borderColor:"rgba(75,192,192,1)",borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",pointBorderColor:"rgba(75,192,192,1)",pointBackgroundColor:"#fff",pointBorderWidth:1,pointHoverRadius:5,pointHoverBackgroundColor:"rgba(75,192,192,1)",pointHoverBorderColor:"rgba(220,220,220,1)",pointHoverBorderWidth:2,pointRadius:1,pointHitRadius:10,data:(null===v||void 0===v?void 0:v.map((function(e){return e.c})))||[]}]},options:{scales:{yAxes:[{ticks:{display:!1}}]}},width:4e3,height:400}));return r.a.createElement(O,{title:null===o||void 0===o?void 0:o.symbol.showName,subtitle:null===o||void 0===o?void 0:o.symbol.ticker,onBack:function(){return e.goBack()}},r.a.createElement("div",{className:"stock-details-view"},v&&b))}function H(){return r.a.createElement(S.a,{basename:"/stocks-view-app"},r.a.createElement("div",{className:"stocks-view-app"},r.a.createElement(N.c,null,r.a.createElement(N.a,{exact:!0,path:"/",component:x}),r.a.createElement(N.a,{path:"/stock-details/:ticker",component:A}))))}n(335),n(336);s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(H,null)),document.getElementById("root"))}},[[146,1,2]]]);
//# sourceMappingURL=main.1fdacfd4.chunk.js.map