import React from "react";
import { connect } from "react-redux";
import { getFocusedMapProxy, zoomTo } from "../../../../../nessMapping/api";

import withNotifications from "../../../../HOC/withNotifications";

import EditProxy from "../../../../../nessMapping/EditProxy";
import {
  setSelectedFeatures,
  updateFeature,
  removeFeature,
} from "../../../../../redux/actions/features";

import {
  selectCurrentLayerUUID,
  selectCurrentFeature,
  selectSelectedFeatures,
} from "../../../../../redux/reducers";
import _ from "lodash";
import EditTool from "../../EditTool";
import { Confirm } from "semantic-ui-react";
import IconButton from "../../../../UI/Buttons/IconButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import "./style.css";
class FeatureDetail extends React.Component {
  state = {
    editing: false,
    properties: null,
    openConfirm: false,
    eraseFeature: {
      openAlert: false,
      content: "? האם באמת למחוק את היישות",
      confirmBtn: "כן",
      cancelBtn: "לא",
    },
  };

  get editProxy() {
    return this._editProxy[this.currentFeature.__Parent_NessUUID__];
  }

  onStartEdit = () => {
    const feature = this.editProxy.getFeatureById(this.currentFeature.id);
    zoomTo(feature.getGeometry());
    this.editProxy.edit(feature);
    this.editProxy.getMetadata();
    this.setState({
      editing: true,
      properties: this.currentFeature.properties,
    });
  };

  onStartEditGeom = () => {
    this.props.onEditGeometry(this.currentFeature);
  };

  onEditCancel = () => {
    this.setState({ editing: false, properties: null });
  };

  onSave = async () => {
    const prop = this.state.properties;
    const updated = await this.editProxy.save(prop);
    if (updated) {
      this.props.successNotification("Successfully saved feature !");
      const newFeature = _.cloneDeep(this.currentFeature);
      newFeature.properties = _.cloneDeep(prop);
      await this.props.updateFeature(this.currentFeature.id, newFeature);
      this.setState({ editing: false, properties: null });
    } else {
      this.props.errorNotification("Failed to save feature !");
    }
  };

  onFeatureDelete = async () => {
    const deleted = await this.editProxy.remove(this.currentFeature.id);
    if (deleted) {
      this.props.successNotification("Successfully delete feature !");
      await this.props.removeFeature(this.currentFeature.id);
      this.setState({ editing: false, properties: null, openConfirm: false });
    } else {
      this.props.errorNotification("Failed to delete feature !");
      this.setState({ editing: false, openConfirm: false });
    }
  };

  get focusedmap() {
    return getFocusedMapProxy().uuid.value;
  }

  get currentFeature() {
    return this.props.currentFeature;
  }

  handleValueChange = (propertyname, value) => {
    this.setState((oldState) => ({
      properties: {
        ...oldState.properties,
        [propertyname]: value,
      },
    }));
  };

  componentDidMount() {
    this._editProxy = EditProxy.getInstance([this.props.CurrentLayerUUID]);
  }

  render() {
    const properties = this.state.properties
      ? this.state.properties
      : this.currentFeature
      ? this.currentFeature.properties
      : null;
    return (
      this.currentFeature && (
        <React.Fragment>
          <div onMouseDownCapture={(e) => e.stopPropagation()}>
            <table className="ui celled table">
              <thead>
                <tr>
                  <th className="details-header">
                    <div>Details</div>
                    {properties.editable ? (
                      !this.state.editing ? (
                        <div>
                          <EditButton onStartEdit={this.onStartEdit} />
                          <IconButton
                            className={`ui icon button pointer primary`}
                            onClick={this.onStartEditGeom}
                            icon="draw-polygon"
                            size="xs"
                          />
                          <IconButton
                            className={`ui icon button pointer negative`}
                            onClick={() => this.setState({ openConfirm: true })}
                            icon="trash-alt"
                            size="xs"
                          />
                        </div>
                      ) : (
                        <div>
                          <IconButton
                            className={`ui icon button pointer positive`}
                            onClick={this.onSave}
                            icon="save"
                            size="xs"
                          />
                          <IconButton
                            className={`ui icon button pointer negative`}
                            onClick={this.onEditCancel}
                            icon="window-close"
                            size="xs"
                          />
                          <IconButton
                            className={`ui icon button pointer negative`}
                            onClick={() => this.setState({ openConfirm: true })}
                            icon="trash-alt"
                            size="xs"
                          />
                        </div>
                      )
                    ) : null}
                  </th>
                </tr>
              </thead>
              <tbody className="scrollContent">
                {Object.keys(properties).map(
                  (property) =>
                    property !== "bbox" &&
                    property !== "editable" && (
                      <tr key={property}>
                        <td>
                          <b>{property}</b>
                        </td>
                        {this.state.editing ? (
                          <td>
                            <input
                              value={this.state.properties[property]}
                              onChange={(e) =>
                                this.handleValueChange(property, e.target.value)
                              }
                            />
                          </td>
                        ) : (
                          <td>{properties[property]}</td>
                        )}
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
          {this.props.CurrentLayerUUID && (
            <EditTool uuid={this.props.CurrentLayerUUID} />
          )}
          <Confirm
            open={this.state.openConfirm}
            size="mini"
            content={this.state.eraseFeature.content}
            cancelButton={this.state.eraseFeature.cancelBtn}
            confirmButton={this.state.eraseFeature.confirmBtn}
            onCancel={() => this.setState({ openConfirm: false })}
            onConfirm={this.onFeatureDelete}
          />
        </React.Fragment>
      )
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Features: state.Features,
    map: state.map.focused,
    CurrentLayerUUID: selectCurrentLayerUUID(state),
    currentFeature: selectCurrentFeature(state),
    selectedFeatures: selectSelectedFeatures(state),
  };
};

export default connect(mapStateToProps, {
  setSelectedFeatures,
  updateFeature,
  removeFeature,
})(withNotifications(FeatureDetail));
