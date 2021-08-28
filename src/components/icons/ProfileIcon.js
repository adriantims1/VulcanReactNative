import React from "react";
import { createIcon } from "native-base";
import { Path, Rect } from "react-native-svg";

const ProfileIcon = ({ color, selected }) => {
  const CustomIcon = createIcon({
    viewBox: "0 0 24 24",
    path: [
      <Rect width="24" height="24" opacity="0" fill="transparent" />,
      <Path
        fill={selected ? "white" : color}
        d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"
      />,
      <Path
        fill={selected ? "white" : color}
        d="M12 13a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z"
      />,
    ],
  });
  return <CustomIcon size={7} />;
};

export default ProfileIcon;
