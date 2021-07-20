import React from "react";
import { createIcon } from "native-base";
import { Path, Rect } from "react-native-svg";

const DownIcon = ({ color }) => {
  const CustomIcon = createIcon({
    viewBox: "0 0 24 24",
    path: [
      <Rect
        width="24"
        height="24"
        opacity="0"
        fill="white"
        transform="rotate(-90 12 12)"
      />,
      <Path
        fill={color}
        d="M17 8a1 1 0 0 0-1 1v5.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29H9a1 1 0 0 0 0 2h8a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"
      ></Path>,
    ],
  });
  return <CustomIcon size={5} />;
};

export default DownIcon;
