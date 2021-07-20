import React from "react";
import { createIcon } from "native-base";
import { Path, Rect } from "react-native-svg";
const UpIcon = ({ color }) => {
  const CustomIcon = createIcon({
    viewBox: "0 0 24 24",
    path: [
      <Rect
        width="24"
        height="24"
        opacity="0"
        transform="rotate(180 12 12)"
        fill="white"
      />,

      <Path
        fill={color}
        d="M18 7.05a1 1 0 0 0-1-1L9 6a1 1 0 0 0 0 2h5.56l-8.27 8.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0L16 9.42V15a1 1 0 0 0 1 1 1 1 0 0 0 1-1z"
      ></Path>,
    ],
  });
  return <CustomIcon size={5} />;
};
export default UpIcon;
