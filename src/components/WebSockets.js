import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  addTradeHistory,
  modifyTradeHistory,
} from "../helper functions/tradeHistory";

//websockets
//asSocket will subscribe to live prices
//wsSocket will be responsible to open deals, calculate wins, and change balance
var asSocket, wsSocket;
var userWsInitializationInterval;
var ref = 1;

var open_rate,
  trend,
  payment,
  todayProfit,
  amount = 0;

var deal_type = "demo";
var uuid = "";

var setShowAnnotation;
function connectWsSocket(
  authtoken,
  deviceid,
  setYAnnotation,

  setTodayProfit
) {
  //<------------------------------------------->
  //Build user Websocket to open deal and get result
  //user Socket instances
  async function setProfit() {
    const storage = await AsyncStorage.getItem("todayProfit");
    if (!storage) {
      return;
    }
    const { date, todayProfit: storageTodayProfit } = JSON.parse(storage);
    const latestDate = new Date(Number(date));
    const now = new Date();
    if (
      latestDate.getDate() === now.getDate() &&
      latestDate.getMonth() === now.getMonth() &&
      latestDate.getFullYear() === now.getFullYear()
    ) {
      todayProfit = storageTodayProfit;
    } else {
      todayProfit = 0;
    }
    setTodayProfit(todayProfit);
  }
  setProfit();

  wsSocket = new WebSocket(
    "wss://ws.strategtry.com/?authtoken=" +
      authtoken +
      "&device=android&device_id=" +
      deviceid +
      "&v=2&vsn=2.0.0"
  );
  //user socket initialization, sending phx_join and interval ping
  wsSocket.onopen = function (e) {
    const toSend = JSON.stringify({
      topic: "base",
      event: "phx_join",
      payload: {},
      ref: ref,
    });
    wsSocket.send(toSend);
    ref += 2;
  };

  //listening to event such as ping, close deal batch (will define the trade result), and heartbeat (user still connected or not)
  wsSocket.onmessage = (res) => {
    res = JSON.parse(res.data);

    if (res.ref === 1) {
      if (res.payload.status === "ok") {
        var toSend = JSON.stringify({
          topic: "base",
          event: "ping",
          payload: {},
          ref: ref,
        });
        wsSocket.send(toSend);
        ref += 1;

        userWsInitializationInterval = setInterval(() => {
          toSend = JSON.stringify({
            topic: "phoenix",
            event: "heartbeat",
            payload: {},
            ref: ref,
          });
          wsSocket.send(toSend);
          ref += 1;
          toSend = JSON.stringify({
            topic: "base",
            event: "ping",
            payload: {},
            ref: ref,
          });
          wsSocket.send(toSend);
          ref += 1;
        }, 50e3);
      }
    } else if (res.event === "close_deal_batch") {
      //Calculate win or loss
      if (res.payload.end_rate > open_rate && trend === "call") {
        modifyTradeHistory("won", payment, deal_type);
        if (deal_type === "real") todayProfit += payment;
      } else if (res.payload.end_rate < open_rate && trend === "put") {
        if (deal_type === "real") modifyTradeHistory("won", payment, deal_type);
        todayProfit += payment;
      } else if (res.payload.end_rate === open_rate) {
        if (deal_type === "real") modifyTradeHistory("tie", amount, deal_type);
      } else {
        modifyTradeHistory("lost", 0, deal_type);
        if (deal_type === "real") todayProfit -= amount;
      }
      if (deal_type === "real") {
        AsyncStorage.setItem(
          "todayProfit",
          JSON.stringify({
            todayProfit,
            date: new Date().getTime(),
          })
        );
        setTodayProfit(todayProfit);
      }
      setShowAnnotation(false, "");
      //Set Trade History
    } else if (res.event === "deal_created") {
      //
      amount = res.payload.amount;
      payment = res.payload.payment;
      open_rate = res.payload.open_rate;
      deal_type = res.payload.deal_type;
      setYAnnotation(res.payload.open_rate);
      trend = res.payload.trend;
      const { uuid, asset_name, status, win } = res.payload;
      setShowAnnotation(true, trend);
      addTradeHistory(
        { uuid, asset_name, status, win, trend },
        res.payload.deal_type
      );
    } else if (res.event === "balance_changed") {
    }
  };
  wsSocket.onclose = function () {
    clearInterval(userWsInitializationInterval);
  };
}

function connectAsSocket() {
  asSocket = new WebSocket("wss://as.strategtry.com/");
}

function subscribeAsSocket(prevRic, ric, shouldUnsubcribe) {
  if (shouldUnsubcribe) unsubscribeAsSocket(prevRic);
  let toSend = JSON.stringify({
    action: "subscribe",
    rics: [ric],
  });

  asSocket.send(toSend);
}

function unsubscribeAsSocket(ric) {
  let toSend = JSON.stringify({
    action: "unsubscribe",
    rics: [ric],
  });

  asSocket.send(toSend);
}

function sendTrade(toSendArgs) {
  const toSend = { ...toSendArgs, ref: ref };

  wsSocket.send(JSON.stringify(toSend));
}

function setTradeHistoryFunc(setShowAnnotationFunc) {
  setShowAnnotation = setShowAnnotationFunc;
}

export {
  asSocket,
  wsSocket,
  connectWsSocket,
  connectAsSocket,
  subscribeAsSocket,
  unsubscribeAsSocket,
  sendTrade,
  setTradeHistoryFunc,
};
