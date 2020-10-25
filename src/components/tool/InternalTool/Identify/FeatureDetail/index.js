import React from "react";
import { connect } from "react-redux";
import { getFocusedMapProxy } from "../../../../../nessMapping/api";
import IconButton from "../../../../UI/Buttons/IconButton";
class FeatureDetail extends React.Component {
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

  render() {
    return this.currentFeature ? (
      <React.Fragment>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>
                Details{" "}
                {this.currentFeature.ol_feature.get("editable") && (
                  <button>Edit</button>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="scrollContent">
            <div className="scrollContent">
              {Object.keys(this.currentFeature.properties).map(
                (property) =>
                  property != "bbox" && (
                    <tr key={property}>
                      <td>{this.currentFeature.properties[property]}</td>
                      <td>
                        <b>{property}</b>
                      </td>
                    </tr>
                  )
              )}
            </div>
          </tbody>
        </table>
      </React.Fragment>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  return { Features: state.Features, map: state.map.focused };
};

export default connect(mapStateToProps)(FeatureDetail);
