import React from "react";
import { createIcon } from "native-base";
import { Circle, Path, Rect } from "react-native-svg";

const HomeIcon = ({ color, selected }) => {
  const CustomIcon = createIcon({
    viewBox: "0 0 24 24",
    path: [
      <Rect
        width="50"
        height="50"
        opacity="0"
        fill={selected ? color : "white"}
      />,

      <Path
        fill={selected ? "white" : color}
        d="M20.42 10.18L12.71 2.3a1 1 0 0 0-1.42 0l-7.71 7.89A2 2 0 0 0 3 11.62V20a2 2 0 0 0 1.89 2h14.22A2 2 0 0 0 21 20v-8.38a2.07 2.07 0 0 0-.58-1.44zM10 20v-6h4v6zm9 0h-3v-7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H5v-8.42l7-7.15 7 7.19z"
      ></Path>,
    ],
  });
  return <CustomIcon size={7} />;
};

export default HomeIcon;
