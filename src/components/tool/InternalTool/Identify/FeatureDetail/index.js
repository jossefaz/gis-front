import React from "react";
import { connect } from "react-redux";
import {
  getFocusedMapProxy,
  getFeatureProperties,
} from "../../../../../nessMapping/api";
import IconButton from "../../../../UI/Buttons/IconButton";
class FeatureDetail extends React.Component {
  state = {
    editing: false,
  };

  onStartEdit = () => {
    this.setState({
      editing: true,
      touched: false,
    });
  };

  onSave = () => {
    console.log(this.currentFeature.ol_feature);
    this.setState({ editing: false });
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
    this.currentFeature.ol_feature.set(propertyname, value);
    this.setState((oldState) => ({ touched: !oldState.touched }));
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
                              value={properties[property]}
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

export default connect(mapStateToProps)(FeatureDetail);
