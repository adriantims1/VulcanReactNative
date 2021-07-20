import React, { useContext } from "react";
import { Line, Rect } from "react-native-svg";

//Context
import ChartDataContext from "../../context/ChartDataContext";

const MARGIN = 2;

const Candle = ({ candle, index, candleWidth: width }) => {
  const { state } = useContext(ChartDataContext);
  const { open, high, low, close } = candle;

  const fill = close > open ? "#4AFA9A" : "#E33F64";
  const x = index * width;
  const max = Math.max(open, close);
  const min = Math.min(open, close);
  return (
    <>
      <Rect
        x={x + MARGIN}
        y={state.scaleY(max)}
        width={width - MARGIN * 2}
        height={state.scaleBody(max - min)}
        fill={fill}
      />
      <Line
        x1={x + width / 2}
        y1={state.scaleY(low)}
        x2={x + width / 2}
        y2={state.scaleY(high)}
        stroke={fill}
        strokeWidth={1}
      />
    </>
  );
};

export default Candle;
