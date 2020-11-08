import React, { Component } from "react";
import ReactDOM from "react-dom";
import { OverlayUtil } from "../../../../../utils/overlay";
import Form from "../../../../UI/Form";
import GenerateUUID from "../../../../../utils/uuid";
import Popup from "../../../../popup";
import {
  getFocusedMap,
  getCurrentProjection,
  getCurrentResolution,
} from "../../../../../nessMapping/api";
import { getCenter, getWidth } from "ol/extent";
import { fromLonLat, transform } from "ol/proj";
import "./style.css";
import withNotifications from "../../../../HOC/withNotifications";
class EditForm extends Component {
  WIDGET_NAME = "EditForm";

  constructor() {
    super();
    this.state = {
      formUUID: `EditForm_${GenerateUUID()}`,
    };
  }

  getFormPosition = () => {
    const center = getCenter(this.props.feature.getGeometry().getExtent());
    var pixel = getFocusedMap().getPixelFromCoordinate(center);
    var pixelX = pixel[0] - 1000;
    var pixelY = pixel[1] - 250;
    return [pixelX, pixelY];
  };

  onSubmit = async (data) => {
    const insterted = await this.props.editProxy.addFeature(
      this.props.feature,
      data
    );
    if (insterted) {
      this.props.successNotification("Successfully added feature !");
    } else {
      this.props.errorNotification("Failed to add feature !");
    }
    ReactDOM.unmountComponentAtNode(this.container);
    this.props.onSubmit();
  };

  generateForm = async () => {
    const position = this.getFormPosition();
    ReactDOM.render(
      <Popup
        position={{
          x: position[0],
          y: position[1],
        }}
      >
        <div className="speech-bubble">
          <Form
            config={this.props.fields}
            formId={this.state.formUUID}
            onSubmit={this.onSubmit}
          />
        </div>
      </Popup>,
      document.body.appendChild(this.container)
    );
  };

  componentDidMount() {
    this.overlays = new OverlayUtil(this.WIDGET_NAME);
    this.container = document.createElement("DIV");
    this.generateForm();
  }

  render() {
    return <React.Fragment></React.Fragment>;
  }
}

export default withNotifications(EditForm);
