import React from "react";
import Form from "../../../../UI/Form";
import GenerateUUID from "../../../../../utils/uuid";
import "./style.css";
import withNotifications from "../../../../HOC/withNotifications";
import AppendBodyComponent from "../../../../HOC/appendBodyElement";
import IconButton from "../../../../UI/Buttons/IconButton";

class EditForm extends AppendBodyComponent {
  WIDGET_NAME = "EditForm";

  constructor() {
    super();
    this.uniqueId = `EditForm_${GenerateUUID()}`;
    this.setAppendElementId(this.uniqueId);
  }

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
      this.props.successNotification("Successfully saved feature !");
    } else {
      this.props.errorNotification("Failed to save feature !");
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
              <IconButton
                className={`ui icon button pointer negative`}
                onClick={this.props.onDeleteFeature}
                icon="trash-alt"
                size="lg"
              />
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
