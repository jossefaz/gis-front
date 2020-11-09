import React from "react";
import { connect } from "react-redux";
import {
  getFocusedMapProxy,
  getFeatureProperties,
} from "../../../../../nessMapping/api";

import withNotifications from "../../../../HOC/withNotifications";

import {
  updateSingleFeature,
  deleteSingleFeature,
} from "../../../../../utils/features";
import EditProxy from "../../../../../nessMapping/EditProxy";
import {
  setSelectedFeatures,
  updateFeature,
  removeFeature,
} from "../../../../../redux/actions/features";
import _ from "lodash";
import EditTool from "../../EditTool";
import { Confirm } from "semantic-ui-react";
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
    return this._editProxy[this.currentFeature.type];
  }

  onStartEdit = () => {
    const feature = this.editProxy.getFeatureById(this.currentFeature.id);
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
  sanityCheck = () => {
    const focusedmapInFeatures = this.focusedmap in this.props.Features;
    const currentFeatureInFeatures = focusedmapInFeatures
      ? "currentFeature" in this.props.Features[this.focusedmap]
      : false;
    const currentFeatureNotNull = currentFeatureInFeatures
      ? this.props.Features[this.focusedmap].currentFeature
      : false;
    return (
      focusedmapInFeatures && currentFeatureInFeatures && currentFeatureNotNull
    );
  };
  get currentFeature() {
    return this.sanityCheck()
      ? this.props.Features[this.focusedmap].currentFeature
      : null;
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
    this._editProxy = EditProxy.getInstance(
      Object.keys(this.props.Features[this.focusedmap].selectedFeatures)
    );
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
            {this.props.Features[this.focusedmap].currentLayer && (
              <EditTool
                ref_name={this.props.Features[this.focusedmap].currentLayer}
              />
            )}
            <table className="ui celled table">
              <thead>
                <tr>
                  <th>
                    Details{" "}
                    {properties.editable ? (
                      !this.state.editing ? (
                        <div>
                          <button onClick={this.onStartEdit}>Edit</button>
                          <button onClick={this.onStartEditGeom}>
                            Edit Geom
                          </button>
                          <button
                            onClick={() => this.setState({ openConfirm: true })}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button onClick={this.onSave}>Save</button>
                          <button onClick={this.onEditCancel}>Cancel</button>
                          <button
                            onClick={() => this.setState({ openConfirm: true })}
                          >
                            Delete
                          </button>
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
  return { Features: state.Features, map: state.map.focused };
};

export default connect(mapStateToProps, {
  setSelectedFeatures,
  updateFeature,
  removeFeature,
})(withNotifications(FeatureDetail));
