import { useState } from "react";
import LayerItem from "./LayerItem";

const CheckboxExampleCheckbox = ({ layersUUID, removeLayer }) => {
  const [activeIndex, setactiveIndex] = useState(-1);
  const openItem = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setactiveIndex(newIndex);
  };
  const renderLayers = () => (
    <div>
      {layersUUID.map((uuid, index) => (
        <LayerItem
          key={uuid}
          uuid={uuid}
          index={index}
          removeLayer={removeLayer}
          activeIndex={activeIndex}
          openItem={openItem}
        />
      ))}
    </div>
  );

  return renderLayers();
};

export default CheckboxExampleCheckbox;
