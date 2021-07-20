import { sendTrade } from "../../components/WebSockets";

//Sending Trade Usage
var tradeInterval;
var tradeTimeout;
var compensation;
var compIndex = 0;
var iso = "USD";
var getCandleData;
var ric;
var balanceType;

//Entry Function
var waitUntil0thSecondInterval;
const startRobot = ({
  maxLoss,
  getCandleData: getCandleDataArgs,
  balanceType: balanceTypeArgs,
  iso: isoArgs,
  ric: ricArgs,
}) => {
  ric = ricArgs;
  iso = isoArgs;
  getCandleData = getCandleDataArgs;
  balanceType = balanceTypeArgs;
  compensation = [
    Math.round(maxLoss * 0.05),
    Math.round(maxLoss * 0.1),
    Math.round(maxLoss * 0.25),
    Math.round(maxLoss * 0.6),
  ];
  let now = new Date();
  if (now.getSeconds() !== 0) {
    waitUntil0thSecondInterval = setInterval(() => {
      if (now.getSeconds() === 0) {
        clearInterval(waitUntil0thSecondInterval);
        startTrading(balanceType);
      } else {
        now.setSeconds(now.getSeconds() + 1);
      }
    }, 1000);
  } else {
    startTrading(balanceType);
  }
};

const startTrading = (balanceType) => {
  tradeTimeout = setTimeout(() => {
    sendTradeOrder(balanceType);
    tradeInterval = setInterval(() => {
      sendTradeOrder(balanceType);
    }, 120e3);
  }, 60e3);
};

const calculateDirection = async () => {
  //data will have the following format: [{open,high,low,close}, ...8, {open,high,low,close}]
  //data.length === 10
  let data = getCandleData();
  data = data[data.length - 1];
  //TODO:
  //Step 1: Normalize the data

  //Step 2: Send it to ML endpoint

  //Step 3: Return the result
  return "call";
};

const sendTradeOrder = async (balanceType) => {
  const direction = await calculateDirection();
  const a = new Date();
  const toSend = {
    topic: "base",
    event: "create_deal",
    payload: {
      amount: compensation[compIndex] * 100,
      created_at: a.getTime(),
      deal_type: balanceType,
      expire_at: 60 * Math.ceil((Math.ceil(a.getTime() / 1e3) + 30) / 60),
      option_type: "turbo",
      iso: iso,
      ric: ric,
      trend: direction,
    },
  };

  sendTrade(toSend);
};

const stopRobot = () => {
  clearInterval(waitUntil0thSecondInterval);
  clearInterval(tradeInterval);
  clearTimeout(tradeTimeout);
};

export { startRobot, stopRobot };
