import React from "react";
import { connect } from "react-redux";
import {
  getFocusedMapProxy,
  getFeatureProperties,
} from "../../../../../nessMapping/api";
import withNotifications from "../../../../HOC/withNotifications";
import { updateSingleFeature } from "../../../../../utils/features";
import _ from "lodash";
class FeatureDetail extends React.Component {
  state = {
    editing: false,
    properties: null,
  };

  onStartEdit = () => {
    this.setState({
      editing: true,
      properties: getFeatureProperties(this.currentFeature.ol_feature),
    });
  };

  onSave = () => {
    const originalProperties = getFeatureProperties(
      this.currentFeature.ol_feature
    );
    Object.keys(originalProperties).map((prop) => {
      if (originalProperties[prop] !== this.state.properties[prop]) {
        this.currentFeature.ol_feature.set(prop, this.state.properties[prop]);
      }
    });
    this.currentFeature.ol_feature.unset("editable");
    updateSingleFeature(this.currentFeature);
    this.props.addToast("Successfully save feature !", {
      appearance: "success",
      autoDismiss: true,
    });
    this.setState({ editing: false, properties: null });
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
                        <button onClick={this.onStartEdit}>Edit</button>
                      ) : (
                        <button onClick={this.onSave}>Save</button>
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
        </React.Fragment>
      )
    );
  }
}

const mapStateToProps = (state) => {
  return { Features: state.Features, map: state.map.focused };
};

export default connect(mapStateToProps)(withNotifications(FeatureDetail));
