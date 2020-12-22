import React, { useState, useRef } from "react";
import { Checkbox } from "semantic-ui-react";
import VectorLayerRegistry from "../../../../../../utils/vectorlayers";
import IconButton from "../../../../../UI/Buttons/IconButton";
import { Confirm } from "semantic-ui-react";
import { Accordion, Button, Icon } from "semantic-ui-react";
import ColorPicker from "../../../../../UI/ColorPicker/ColorPicker";
import { generateNewPolygonStyle } from "../../../../../../utils/func";
import FeatureList from "./FeatureList";
import styles from "../../../../../../nessMapping/mapStyle";
import "./style.css";
import ContentEditable from "react-contenteditable";
import { unhighlightFeature } from "../../../../../../nessMapping/api";
import {
  exportGeoJSonToShp,
  featuresToGeoJson,
} from "../../../../../../utils/export";
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

  const setStyleToFeatures = (style) => {
    registry
      .getVectorLayer(uuid)
      .source.getFeatures()
      .map((f) => f.setStyle(style));
  };

  const eraselayer = {
    content: "? האם באמת למחוק את היישות",
    confirmBtn: "כן",
    cancelBtn: "לא",
  };
  const toggleLayer = () => {
    if (Checked) {
      setStyleToFeatures(styles.HIDDEN);
    } else {
      setStyleToFeatures(layerStyle);
    }
    registry.getVectorLayer(uuid)._toggleVisibility();
    setChecked(!Checked);
  };

  const removeLocalLayer = () => {
    // TODO : Remove the line on setting the style of each feature to hidden...it just here to fix a bug of remainings features after delete
    currentlayerSource.getFeatures().map((f) => f.setStyle(styles.HIDDEN));
    unhighlightFeature();
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
  const title = useRef(`selection ${index + 1}`);

  const handleTitleChange = (evt) => {
    title.current = evt.target.value;
  };

  const exportToShape = () => {
    if (currentlayerSource.getFeatures().length > 0) {
      const geoJson = featuresToGeoJson(currentlayerSource.getFeatures());
      exportGeoJSonToShp(geoJson);
    }
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
    const style = generateNewPolygonStyle(
      currentFill,
      currentStroke,
      outlineWidth
    );
    registry.getVectorLayer(uuid)._setStyle(style);
    setStyleToFeatures(style);
    setLayerStyle(style);
  };

  return (
    <React.Fragment>
      <div className="displayFlex">
        <Checkbox
          key={uuid}
          value={uuid}
          onChange={toggleLayer}
          checked={Checked}
        />
        <ContentEditable html={title.current} onChange={handleTitleChange} />
        <IconButton
          className={`ui icon button pointer negative`}
          onClick={() => setModal(true)}
          icon="trash-alt"
          size="xs"
        />
        <IconButton
          className={`ui icon button pointer negative`}
          onClick={exportToShape}
          icon="download"
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
              icon="palette"
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
              active={activeIndex === `${uuid}_2`}
              index={`${uuid}_2`}
              onClick={openItem}
            >
              <IconButton
                className={`ui icon button pointer positive`}
                onClick={() => {}}
                icon="table"
                size="xs"
              />
            </Accordion.Title>
            <Accordion.Content active={activeIndex === `${uuid}_2`}>
              <FeatureList
                currentlayerSource={currentlayerSource}
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
