import React from "react";
import { Line, Rect } from "react-native-svg";

const MARGIN = 2;

const Candle = ({ candle, index, candleWidth: width, scaleY, scaleBody }) => {
  const { open, high, low, close } = candle;

  const fill = close > open ? "#4AFA9A" : close < open ? "#E33F64" : "darkgrey";
  const x = index * width;
  const max = Math.max(open, close);
  const min = Math.min(open, close);
  return (
    <>
      <Rect
        x={x + MARGIN}
        y={scaleY(max)}
        width={width - MARGIN * 2}
        height={scaleBody(max - min)}
        fill={fill}
      />
      <Line
        x1={x + width / 2}
        y1={scaleY(low)}
        x2={x + width / 2}
        y2={scaleY(high)}
        stroke={fill}
        strokeWidth={1}
      />
    </>
  );
};

export default Candle;
