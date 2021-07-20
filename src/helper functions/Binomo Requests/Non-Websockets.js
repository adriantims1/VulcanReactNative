import axios from "axios";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { asSocket } from "../../components/WebSockets";
import { scaleLinear } from "d3-scale";

const { width: size } = Dimensions.get("window");

const getBalance = async () => {
  try {
    let authtoken = await AsyncStorage.getItem("authtoken");
    let deviceid = await AsyncStorage.getItem("deviceid");
    let config = {
      headers: {
        "Authorization-Token": authtoken,
        "Device-Id": deviceid,
        "Device-Type": "android",
        "Authorization-Version": 2,
      },
    };
    let data = await axios.get(
      "https:api.binomo.com/bank/v1/read?locale=en",
      config
    );
    data = data.data.data;
    return {
      status: "success",
      payload: { demo: data[0].amount / 100, real: data[1].amount / 100 },
    };
  } catch (err) {
    console.log(err);
    return { status: "fail", payload: {} };
  }
};

const getAvailableMarket = async () => {
  try {
    let authtoken = await AsyncStorage.getItem("authtoken");
    let deviceid = await AsyncStorage.getItem("deviceid");
    let config = {
      headers: {
        "Authorization-Token": authtoken,
        "Device-Id": deviceid,
        "Device-Type": "android",
        "Authorization-Version": 2,
      },
    };
    let data = await axios.get(
      "https:api.binomo.com/platform/private/v3/assets?locale=en",
      config
    );
    data = data.data.data.assets;
    const d = new Date();
    const day = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var today =
      10 <= d.getUTCHours()
        ? d.getUTCHours() +
          ":" +
          (10 > d.getUTCMinutes() ? "0" + d.getUTCMinutes() : d.getUTCMinutes())
        : "0" +
          d.getUTCHours() +
          ":" +
          (10 > d.getUTCMinutes()
            ? "0" + d.getUTCMinutes()
            : d.getUTCMinutes());

    var temporaryCandle = [];

    data.forEach((el) => {
      if (
        el.active &&
        el.trading_tools_settings.option.base_payment_rate_turbo >= 80 &&
        /*check the demo and real availability &&*/ today >
          el.trading_tools_settings.option.schedule[day[d.getUTCDay()]][0][0] &&
        today <
          el.trading_tools_settings.option.schedule[day[d.getUTCDay()]][0][1]
      ) {
        temporaryCandle.push({
          name: el.name,
          ric: el.ric,
          percent: el.trading_tools_settings.option.base_payment_rate_turbo,
          url: el.icon.url,
        });
      }
    });
    return { status: "success", payload: { allMarket: temporaryCandle } };
  } catch (err) {
    console.log(err);
    return { status: "fail", payload: {} };
  }
};

let stateData = [];
var largest,
  smallest = -1;
const getCandles = async (ric, setData, setScale) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    let data = await axios.get(
      `https:api.binomo.com//platform/candles/${ric}/${today}T00:00:00/60?locale=en`
    );
    data = data.data.data;
    data = data.slice(data.length - 10);
    stateData = data;
    const domain = getDomain(data);
    smallest = domain[0];
    largest = domain[1];
    sendSetScaleData(domain, setScale);
    setData(data);
  } catch (err) {
    console.log("error in getCandles", err);
  }
};
var allowUpdate = true;

const getDomain = (candles) => {
  const values = candles.map(({ high, low }) => [high, low]).flat();
  return [Math.min(...values), Math.max(...values)];
};

const sendSetScaleData = (domain, setScale) => {
  scaleY = scaleLinear()
    .domain(domain)
    .range([size * 0.9, 0])
    .clamp(true);
  scaleBody = scaleLinear()
    .domain([0, Math.max(...domain) - Math.min(...domain)])
    .range([0, size * 0.9])
    .clamp(true);

  setScale({ scaleY, scaleBody });
};

const initCandles = async (ric, setData, setScale) => {
  await getCandles(ric, setData, setScale);
  let shallUpdate1 = true;
  asSocket.onmessage = (res) => {
    res = JSON.parse(res.data);
    if (!res.data[0]?.assets) {
      return;
    }
    res = res.data[0].assets[0];
    try {
      if (stateData.length > 0 && allowUpdate) {
        allowUpdate = false;
        setTimeout(() => {
          allowUpdate = true;
        }, 1000);
        let temp = stateData;
        var domain;

        if (
          shallUpdate1 &&
          (res.created_at.slice(17, 19) === "59" ||
            res.created_at.slice(17, 19) === "00")
        ) {
          shallUpdate1 = false;
          setTimeout(() => {
            shallUpdate1 = true;
          }, 2000);
          temp.shift();
          temp.push({
            open: res.rate,
            high: res.rate,
            low: res.rate,
            close: res.rate,
          });
          domain = getDomain(temp);
          largest = domain[1];
          smallest = domain[0];

          sendSetScaleData(domain, setScale);
        } else if (res.rate > temp[temp.length - 1].high) {
          temp[temp.length - 1].high = res.rate;
        } else if (res.rate < temp[temp.length - 1].low) {
          temp[temp.length - 1].low = res.rate;
        }
        temp[temp.length - 1].close = res.rate;
        temp[temp.length - 1].created_at = res.created_at;

        stateData = temp;
        domain = getDomain(temp);
        if (smallest < 0 || domain[0] < smallest || domain[1] > largest) {
          smallest = domain[0];
          largest = domain[1];
          sendSetScaleData(domain, setScale);
        }
        setData(temp);
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export { getBalance, getAvailableMarket, getCandles, initCandles };
