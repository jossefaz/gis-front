import React from "react";
import { Checkbox } from "semantic-ui-react";
import LayerItem from "./LayerItem";

const CheckboxExampleCheckbox = ({ layersUUID, removeLayer }) => {
  const renderLayers = () => (
    <div>
      {layersUUID.map((uuid, index) => (
        <LayerItem
          key={uuid}
          uuid={uuid}
          index={index}
          removeLayer={removeLayer}
        />
      ))}
    </div>
  );

  return renderLayers();
};

export default CheckboxExampleCheckbox;
