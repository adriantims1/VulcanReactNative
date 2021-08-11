import AsyncStorage from "@react-native-async-storage/async-storage";
import { replaceLatestCandle, insertNewCandle } from "./candleDataAction";
import waitit from "waitit";
import axios from "axios";

//Type
import {
  CONNECT_WEBSOCKET,
  CONNECT_WEBSOCKET_SUCCESS,
  CONNECT_WEBSOCKET_FAIL,
} from "../constants/types/webSocket";
import { MODIFY_BALANCE } from "../constants/types/profileData";
import {
  START_ROBOT,
  STOP_ROBOT,
  WAIT_ROBOT,
} from "../constants/types/marketData";

//Action
import { addAnnotation, removeAnnotation } from "./marketDataAction";
import { dealCreated } from "./tradeDataAction";
import {
  addNewTradeHistory,
  closeLatestTradeHistory,
} from "./profileDataAction";

//Url
import { BINOMO_AS, BINOMO_WS } from "../constants/url/binomoUrl";
import { GET_MACHINE_LEARNING_URL } from "../constants/url/mlPredictionUrl";

//WebSocket Function
var wsInterval;
var ref = 1;
var as, ws;
var dispatchGlobal;
var globalAuthToken, globalDeviceId;
var compIndex = 0;
var toSend;

export const connectWebSocket = (authToken, deviceId, success) => {
  return (dispatch) => {
    dispatch({ type: CONNECT_WEBSOCKET });
    dispatchGlobal = dispatch;
    ws = new WebSocket(BINOMO_WS(authToken, deviceId));
    ws.onclose = () => {
      ref = 1;
    };
    ws.onerror = (res) => {
      console.log(res);
      dispatch({ type: CONNECT_WEBSOCKET_FAIL, payload: res.message });
    };
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          topic: "base",
          event: "phx_join",
          payload: {},
          ref: ref,
        })
      );
      ref += 2;
      globalAuthToken = authToken;
      globalDeviceId = deviceId;
      listenWsResponse();
      AsyncStorage.setItem("authtoken", authToken);
      AsyncStorage.setItem("deviceid", deviceId);
      as = new WebSocket(BINOMO_AS());
      as.onopen = () => {
        subscribeAsSocket("", "Z-CRY/IDX", false);
        success();
        dispatch({
          type: CONNECT_WEBSOCKET_SUCCESS,
          payload: { ws, as },
        });
      };
      as.onerror = (res) => {
        console.log(res);
        dispatch({ type: CONNECT_WEBSOCKET_FAIL, payload: res.message });
      };
    };
  };
};

const listenWsResponse = () => {
  ws.onmessage = (res) => {
    res = JSON.parse(res.data);

    switch (res.event) {
      case "phx_reply":
        if (res.payload.status !== "ok") {
          console.log(res);
          dispatchGlobal({
            type: CONNECT_WEBSOCKET_FAIL,
            payload: "cannot connect",
          });
          break;
        } else if (res.ref !== 1) break;
        ws.send(
          JSON.stringify({
            topic: "base",
            event: "ping",
            payload: {},
            ref: ref,
          })
        );
        ref += 1;
        wsInterval = setInterval(() => {
          toSend = JSON.stringify({
            topic: "phoenix",
            event: "heartbeat",
            payload: {},
            ref: ref,
          });
          console.log(toSend);
          ws.send(toSend);
          ref += 1;
          toSend = JSON.stringify({
            topic: "base",
            event: "ping",
            payload: {},
            ref: ref,
          });
          ws.send(toSend);
          console.log(toSend);
          ref += 1;
        }, 50e3);
        break;
      case "deal_created":
        console.log("deal_created");
        const { asset_name, status, trend, win, deal_type, amount } =
          res.payload;
        dispatchGlobal(dealCreated(res.payload));
        dispatchGlobal(addAnnotation(res.payload.open_rate, res.payload.trend));
        dispatchGlobal(
          addNewTradeHistory({ asset_name, status, trend, win }, deal_type)
        );

        break;
      case "close_deal_batch":
        //Calculate Win or Loss
        console.log("close_deal_batch");
        dispatchGlobal(removeAnnotation());
        dispatchGlobal(closeLatestTradeHistory(res.payload.end_rate));
        break;
      case "change_balance":
        dispatchGlobal({
          type: MODIFY_BALANCE,
          payload: {
            real: res.payload.balance,
            demo: res.payload.demo_balance,
          },
        });
        break;
    }
  };
};

export function subscribeAsSocket(prevRic, ric, shouldUnsubcribe) {
  if (shouldUnsubcribe) unsubscribeAsSocket(prevRic);
  let toSend = JSON.stringify({
    action: "subscribe",
    rics: [ric],
  });
  as.send(toSend);
  console.log(toSend);
}
function unsubscribeAsSocket(ric) {
  let toSend = JSON.stringify({
    action: "unsubscribe",
    rics: [ric],
  });
  as.send(toSend);
  console.log(toSend);
}

export const listenAsResponse = () => {
  return (dispatch, getState) => {
    let flag = true;
    let shallAdd = true;
    as.onmessage = (res) => {
      res = JSON.parse(res.data);
      if (!flag || res.data[0].action !== "assets") return;
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 1000);
      //update logic
      res = res.data[0].assets[0];
      const { candleData } = getState();
      if (
        res.created_at.slice(17, 19) === "00" ||
        (res.created_at.slice(17, 19) === "01" && shallAdd)
      ) {
        shallAdd = false;
        setTimeout(() => {
          shallAdd = true;
        }, 2000);
        dispatch(
          insertNewCandle(
            {
              open: res.rate,
              high: res.rate,
              low: res.rate,
              close: res.rate,
              created_at: res.created_at,
            },
            candleData.data
          )
        );
      } else {
        dispatch(
          replaceLatestCandle(res.rate, res.created_at, candleData.data)
        );
      }
    };
  };
};

export const stopListeningAsResponse = () => {
  return () => {
    as.onmessage = () => {};
  };
};

export const disconnectWebSocket = () => {
  return () => {
    as.close();
    ws.close();
    ref = 1;
    clearInterval(wsInterval);
  };
};

var tradeInterval;
export const startRobot = () => {
  return async (dispatch, getState) => {
    dispatch({ type: WAIT_ROBOT });
    try {
      let time;
      await waitit.start({
        check: () => {
          const { candleData } = getState();
          console.log(candleData.data[candleData.data.length - 1].created_at);
          time = new Date(
            candleData.data[candleData.data.length - 1].created_at
          ).getSeconds();
          return time === 59 || time === 0;
        },
        maxTicks: 60,
      });
      let { profileData, marketData, candleData } = getState();
      const compensation = [
        Math.round(profileData.settings.maxLoss * 0.05 * 100),
        Math.round(profileData.settings.maxLoss * 0.1 * 100),
        Math.round(profileData.settings.maxLoss * 0.25 * 100),
        Math.round(profileData.settings.maxLoss * 0.6 * 100),
      ];
      let pred = await calculatePrediction();
      sendTrade({
        amount: compensation[compIndex],
        created_at: new Date(
          candleData.data[candleData.data.length - 1].created_at
        ).getSeconds(),
        deal_type: profileData.settings.balanceType,
        iso: profileData.iso,
        ric: marketData.selectedMarket.ric,
        trend: pred,
      });
      dispatch({ type: START_ROBOT });
      tradeInterval = setInterval(async () => {
        let { profileData, marketData } = getState();
        time = time;
        let pred = await calculatePrediction();
        sendTrade({
          amount: compensation[compIndex],
          created_at: time,
          deal_type: profileData.settings.balanceType,
          iso: profileData.iso,
          ric: marketData.selectedMarket.ric,
          trend: pred,
        });
      }, 120e3);
    } catch (err) {
      console.log(err);
    }
  };
};

const calculatePrediction = async () => {
  const result = await axios.post(GET_MACHINE_LEARNING_URL(), {});
  return result.data.data;
};

const sendTrade = ({ amount, created_at, deal_type, iso, ric, trend }) => {
  let payload = {
    amount,
    created_at,
    deal_type,
    iso,
    ric,
    trend,
    option_type: "turbo",
    created_at,
    expire_at: 60 * Math.ceil((Math.ceil(Date.now() / 1e3) + 30) / 60),
  };
  ws.send(
    JSON.stringify({
      topic: "base",
      event: "create_deal",
      payload,
      ref,
    })
  );
  ref += 1;
};

export const stopRobot = () => {
  return (dispatch) => {
    clearInterval(tradeInterval);
    dispatch({ type: STOP_ROBOT });
  };
};
