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
import AppendBodyComponent from "../../../../HOC/appendBodyElement";

class EditForm extends AppendBodyComponent {
  WIDGET_NAME = "EditForm";

  constructor() {
    super();
    this.uniqueId = `EditForm_${GenerateUUID()}`;
    this.setAppendElementId(this.uniqueId);
  }

  getFormPosition = () => {
    const center = getCenter(this.props.feature.getGeometry().getExtent());
    var pixel = getFocusedMap().getPixelFromCoordinate(center);
    var pixelX = pixel[0] - 770;
    var pixelY = pixel[1] - 70;
    return [pixelX, pixelY];
  };

  onSubmit = async (data) => {
    if (this.props.existingFeature) {
      await this.editFeature(data);
    } else {
      await this.newFeature(data);
    }
    this.props.onSubmit();
  };

  editFeature = async (data) => {
    const updated = await this.props.editProxy.save(data);
    if (updated) {
      this.props.successNotification("Successfully added feature !");
    } else {
      this.props.errorNotification("Failed to add feature !");
    }
    this.removeAppendElement();
  };

  newFeature = async (data) => {
    const insterted = await this.props.editProxy.addFeature(
      this.props.feature,
      data
    );
    if (insterted) {
      this.props.successNotification("Successfully added feature !");
    } else {
      this.props.errorNotification("Failed to add feature !");
    }
    this.removeAppendElement();
  };

  generateForm = () => {
    this.props.feature &&
      this.updateAppendElement(
        <div className="speech-bubble" key="edit-form-div">
          <Form
            config={this.props.fields}
            onSubmit={this.onSubmit}
            values={this.props.values}
            optionalButton={() => (
              <button onClick={this.props.onDeleteFeature}>Delete</button>
            )}
          />
        </div>
      );
  };

  componentDidMount() {
    this.generateForm();
  }

  componentDidUpdate() {
    if (!this.props.openForm) {
      this.removeAppendElement();
    } else {
      this.generateForm();
    }
  }
  componentWillUnmount() {
    this.removeAppendElement();
  }

  render() {
    return null;
  }
}

export default withNotifications(EditForm);
