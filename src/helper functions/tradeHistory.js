var tradeHistory = { demo: [], real: [] };
var setTradeHistory;

const modifyTradeHistory = (status, win, deal_type) => {
  if (deal_type === "demo") {
    let [firstEl, ...restEl] = tradeHistory.demo;
    firstEl = { ...firstEl, status, win };
    tradeHistory = { ...tradeHistory, demo: [firstEl, ...restEl] };
  } else {
    let [firstEl, ...restEl] = tradeHistory.real;
    firstEl = { ...firstEl, status, win };
    tradeHistory = { ...tradeHistory, real: [firstEl, ...restEl] };
  }
  setTradeHistory(tradeHistory);
};
const addTradeHistory = (newDeal, deal_type) => {
  if (deal_type === "demo") {
    tradeHistory = { ...tradeHistory, demo: [newDeal, ...tradeHistory.demo] };
  } else {
    tradeHistory = { ...tradeHistory, real: [newDeal, ...tradeHistory.real] };
  }
  setTradeHistory(tradeHistory);
};

const initTradeHistory = (arrayOfTradeHistory, setTradeHistoryArgs) => {
  tradeHistory = arrayOfTradeHistory;
  setTradeHistory = setTradeHistoryArgs;
};

export { tradeHistory, initTradeHistory, modifyTradeHistory, addTradeHistory };
