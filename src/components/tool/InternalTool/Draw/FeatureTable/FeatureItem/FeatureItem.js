import React, { useState } from "react";
import ColorPicker from "../../../../../UI/ColorPicker/ColorPicker";
import { generateNewPolygonStyle } from "../../../../../../utils/func";
import IconButton from "../../../../../UI/Buttons/IconButton";
import API from "../../../../../../core/api";
import { Table } from "semantic-ui-react";
import "./style.css";
import { Button, ButtonGroup } from "react-bootstrap";
const { unhighlightFeature } = API.features;
const FeatureItem = (props) => {
  const [fillColor, setFillColor] = useState({
    r: "154",
    g: "111",
    b: "222",
    a: "0.2",
  });
  const [outlineWidth, setOutlineWidth] = useState(2);

  const editStyle = {
    stroke: `rgba(19,187,254,.87)`,
    fill: `rgba(255,255,255,0.7)`,
  };

  const [strokeColor, setStrokeColor] = useState(props.defaultColor);
  const removeFeature = () => {
    const feature = getFeature();
    // deleteGeometry(feature);
    props.source.removeFeature(feature);
    unhighlightFeature();
    props.deleteLastFeature(props.fid);
  };
  const edit = () => {
    props.onOpenEditSession(props.fid);
  };
  const getFeature = () => props.source.getFeatureById(props.fid);
  const updateStyle = () => {
    if (getFeature()) {
      const currentStroke = `rgba(${strokeColor.r},${strokeColor.g},${strokeColor.b},${strokeColor.a})`;
      const currentFill = `rgba(${fillColor.r},${fillColor.g},${fillColor.b},${fillColor.a})`;
      getFeature().setStyle(
        generateNewPolygonStyle(currentFill, currentStroke, outlineWidth)
      );
    }
  };
  if (!props.editSession.status) {
    updateStyle();
  } else {
    if (props.editSession.current === props.fid) {
      getFeature().setStyle(
        generateNewPolygonStyle(editStyle.fill, editStyle.stroke, 3)
      );
    } else {
      updateStyle();
    }
  }

  return (
    <div className="d-flex px-tool py-2 border-top">
      <div className="flex-grow-1 d-flex align-items-center">
        <span>קו</span>
        <ColorPicker
          withWidth
          initialWidth={outlineWidth}
          onWidthChange={(newWidth) => setOutlineWidth(newWidth)}
          onColorChange={(newStrokeColor) => setStrokeColor(newStrokeColor)}
          defaultColor={strokeColor}
          className="mr-2"
        />
      </div>
      <div className="flex-grow-1 d-flex align-items-center">
        <span>מילוי</span>
        <ColorPicker
            onColorChange={(newFillColor) => setFillColor(newFillColor)}
            defaultColor={fillColor}
            className="mr-2"
          />
      </div>
      <ButtonGroup>
        <Button variant="transparent" onClick={removeFeature}>
          <i className="gis-icon gis-icon--trash"></i>
        </Button>
        <Button variant="transparent" onClick={edit}>
          <i className="gis-icon gis-icon--pencil-on-square"></i>
        </Button>
      </ButtonGroup>
    </div>
  );

  return (
    <React.Fragment>
      <Table.Cell>
        <p>{props.index + 1}</p>
      </Table.Cell>
      <Table.Cell>
        <div className="displayFlex">
          <label className="labels">קו חיצוני :</label>
          <ColorPicker
            withWidth
            initialWidth={outlineWidth}
            onWidthChange={(newWidth) => setOutlineWidth(newWidth)}
            onColorChange={(newStrokeColor) => setStrokeColor(newStrokeColor)}
            defaultColor={strokeColor}
          />
        </div>
        <div className="displayFlex">
          <label className="labels">מילוי :</label>
          <ColorPicker
            onColorChange={(newFillColor) => setFillColor(newFillColor)}
            defaultColor={fillColor}
          />
        </div>
      </Table.Cell>
      <Table.Cell>
        <IconButton
          className="ui icon button pointer negative"
          onClick={removeFeature}
          icon="trash-alt"
          size="lg"
        />
        <IconButton
          className="ui icon button pointer positive"
          onClick={edit}
          icon="edit"
          size="lg"
        />
      </Table.Cell>
    </React.Fragment>
  );
};
export default FeatureItem;
