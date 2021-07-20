import React from "react";
import { createIcon } from "native-base";
import { Path, Rect } from "react-native-svg";

const TradingIcon = ({ color, selected }) => {
  const CustomIcon = createIcon({
    viewBox: "0 0 24 24",
    path: [
      <Rect
        x={0}
        y={0}
        fill={selected ? color : "white"}
        width="24"
        height="24"
        opacity="0"
        transform="rotate(90 12 12)"
      ></Rect>,
      <Path
        fill={selected ? "white" : color}
        d="M12 4a1 1 0 0 0-1 1v15a1 1 0 0 0 2 0V5a1 1 0 0 0-1-1z"
      />,
      <Path
        fill={selected ? "white" : color}
        d="M19 12a1 1 0 0 0-1 1v7a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1z"
      />,
      <Path
        fill={selected ? "white" : color}
        d="M5 8a1 1 0 0 0-1 1v11a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1z"
      />,
    ],
  });
  return <CustomIcon size={7} />;
};

export default TradingIcon;
