import React from "react";
import IconButton from "../IconButton";
export default ({ onStartEdit }) => {
  return (
    <IconButton
      className={`ui icon button pointer primary`}
      onClick={onStartEdit}
      icon="edit"
      size="xs"
    />
  );
};
