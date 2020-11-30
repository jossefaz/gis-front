import React, { useState } from "react";
import { Checkbox } from "semantic-ui-react";
import VectorLayerRegistry from "../../../../../../utils/vectorlayers";
import IconButton from "../../../../../UI/Buttons/IconButton";
import { Confirm } from "semantic-ui-react";
import { Accordion, Button, Icon } from "semantic-ui-react";
import ColorPicker from "../../../../../UI/ColorPicker/ColorPicker";
import { generateNewStyle } from "../../../../../../utils/func";
import FeatureList from "./FeatureList";
import styles from "../../../../../../nessMapping/mapStyle";
import "./style.css";
const LayerItem = ({ uuid, index, removeLayer, activeIndex, openItem }) => {
  const registry = VectorLayerRegistry.getInstance();
  const currentlayerSource = registry.getVectorLayer(uuid)
    ? registry.getVectorLayer(uuid).source
    : null;
  const [Checked, setChecked] = useState(true);
  const [Modal, setModal] = useState(false);
  const [fillColor, setFillColor] = useState({
    r: "154",
    g: "111",
    b: "222",
    a: "0.2",
  });
  const [outlineWidth, setOutlineWidth] = useState(2);
  const [strokeColor, setStrokeColor] = useState({
    r: "241",
    g: "112",
    b: "19",
    a: "1",
  });

  const [update, setUpdate] = useState(false);

  const [layerStyle, setLayerStyle] = useState(styles.DRAW_END);

  const eraselayer = {
    content: "? האם באמת למחוק את היישות",
    confirmBtn: "כן",
    cancelBtn: "לא",
  };
  const toggleLayer = () => {
    registry.getVectorLayer(uuid)._toggleVisibility();
    setChecked(!Checked);
  };

  const removeLocalLayer = () => {
    removeLayer(uuid);
    setModal(false);
  };

  const removeFeature = (feature) => {
    currentlayerSource.removeFeature(feature);
    if (currentlayerSource.getFeatures().length == 0) {
      removeLocalLayer();
    }
    setUpdate(!update);
  };

  const updateColor = (width, stroke, Fill) => {
    if (width) {
      setOutlineWidth(width);
    }
    if (stroke) {
      setStrokeColor(stroke);
    }
    if (Fill) {
      setFillColor(Fill);
    }
    const currentStroke = `rgba(${stroke.r},${stroke.g},${stroke.b},${stroke.a})`;
    const currentFill = `rgba(${Fill.r},${Fill.g},${Fill.b},${Fill.a})`;
    const style = generateNewStyle(currentFill, currentStroke, outlineWidth);
    registry.getVectorLayer(uuid)._setStyle(style);
    setLayerStyle(style);
  };

  return (
    <React.Fragment>
      <div className="displayFlex">
        <Checkbox
          key={uuid}
          value={uuid}
          label={`selection ${index}`}
          onChange={toggleLayer}
          checked={Checked}
        />
        <IconButton
          className={`ui icon button pointer negative`}
          onClick={() => setModal(true)}
          icon="trash-alt"
          size="xs"
        />
        <Accordion>
          <Accordion.Title
            active={activeIndex === index}
            index={index}
            onClick={openItem}
          >
            <IconButton
              className={`ui icon button pointer positive`}
              onClick={() => {}}
              icon="cogs"
              size="xs"
            />
          </Accordion.Title>
          <Accordion.Content active={activeIndex === index}>
            <div className="controls">
              <label className="labels">קו חיצוני :</label>
              <ColorPicker
                withWidth
                initialWidth={`${outlineWidth}`}
                onWidthChange={(newWidth) =>
                  updateColor(newWidth, strokeColor, fillColor)
                }
                onColorChange={(newStrokeColor) =>
                  updateColor(outlineWidth, newStrokeColor, fillColor)
                }
                defaultColor={strokeColor}
              />

              <label className="labels">מילוי :</label>
              <ColorPicker
                onColorChange={(newFillColor) =>
                  updateColor(outlineWidth, strokeColor, newFillColor)
                }
                defaultColor={fillColor}
              />
            </div>
          </Accordion.Content>
        </Accordion>
        {currentlayerSource && (
          <Accordion>
            <Accordion.Title
              active={activeIndex === 2}
              index={2}
              onClick={openItem}
            >
              <IconButton
                className={`ui icon button pointer positive`}
                onClick={() => {}}
                icon="table"
                size="xs"
              />
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>
              <FeatureList
                featuresArray={currentlayerSource.getFeatures()}
                removeFeature={removeFeature}
                layerStyle={layerStyle}
              />
            </Accordion.Content>
          </Accordion>
        )}
      </div>

      <Confirm
        open={Modal}
        size="mini"
        content={eraselayer.content}
        cancelButton={eraselayer.cancelBtn}
        confirmButton={eraselayer.confirmBtn}
        onCancel={() => setModal(false)}
        onConfirm={removeLocalLayer}
      />
    </React.Fragment>
  );
};

export default LayerItem;
