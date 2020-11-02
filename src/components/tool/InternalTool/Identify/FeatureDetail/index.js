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
import { setSelectedFeatures } from "../../../../../redux/actions/features";
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

  onStartEdit = () => {
    this.setState({
      editing: true,
      properties: getFeatureProperties(this.currentFeature.ol_feature),
    });
  };

  onEditCancel = () => {
    this.setState({ editing: false, properties: null });
  };

  onSave = async () => {
    const originalProperties = getFeatureProperties(
      this.currentFeature.ol_feature
    );
    Object.keys(originalProperties).map((prop) => {
      if (originalProperties[prop] !== this.state.properties[prop]) {
        this.currentFeature.ol_feature.set(prop, this.state.properties[prop]);
      }
    });
    this.currentFeature.ol_feature.unset("editable");
    const updated = await updateSingleFeature(this.currentFeature);
    if (updated) {
      this.currentFeature.ol_feature.set("editable", true);
      this.props.addToast("Successfully save feature !", {
        appearance: "success",
        autoDismiss: true,
      });
      this.setState({ editing: false, properties: null });
    } else {
      this.currentFeature.ol_feature.set("editable", true);
      Object.keys(originalProperties).map((prop) => {
        this.currentFeature.ol_feature.set(prop, originalProperties[prop]);
      });
      this.props.addToast("failed to update feature !", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  onFeatureDelete = async () => {
    const deleted = await deleteSingleFeature(this.currentFeature);
    if (deleted) {
      const selectedFeatures = this.props.Features[
        this.focusedmap
      ].selectedFeatures[this.currentFeature.type]
        .filter((f) => f.id !== this.currentFeature.id)
        .map((f) => f.ol_feature);
      this.props.setSelectedFeatures(selectedFeatures);
      this.props.addToast("Successfully delete feature !", {
        appearance: "success",
        autoDismiss: true,
      });

      this.setState({ editing: false, properties: null, openConfirm: false });
    } else {
      this.props.addToast("Failed to delete feature !", {
        appearance: "error",
        autoDismiss: true,
      });
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

  render() {
    const properties =
      this.currentFeature &&
      getFeatureProperties(this.currentFeature.ol_feature);
    return (
      this.currentFeature && (
        <React.Fragment>
          <div onMouseDownCapture={(e) => e.stopPropagation()}>
            <table className="ui celled table">
              <thead>
                <tr>
                  <th>
                    Details{" "}
                    {this.currentFeature.ol_feature.get("editable") ? (
                      !this.state.editing ? (
                        <div>
                          <button onClick={this.onStartEdit}>Edit</button>
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

export default connect(mapStateToProps, { setSelectedFeatures })(
  withNotifications(FeatureDetail)
);
