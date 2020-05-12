import React from "react";
import { connect } from "react-redux";
import { getFocusedMapProxy } from '../../../../../nessMapping/api';
class FeatureDetail extends React.Component {
  get focusedmap() {
    return getFocusedMapProxy().uuid.value
  }
  sanityCheck = () => {
    const focusedmapInFeatures = this.focusedmap in this.props.Features
    const currentFeatureInFeatures = focusedmapInFeatures ? "currentFeature" in this.props.Features[this.focusedmap] : false
    const currentFeatureNotNull = currentFeatureInFeatures ? this.props.Features[this.focusedmap].currentFeature : false
    return focusedmapInFeatures && currentFeatureInFeatures && currentFeatureNotNull


  }
  get currentFeature() {
    return this.sanityCheck() ? this.props.Features[this.focusedmap].currentFeature : null
  }

  render() {
    return this.currentFeature ? (
      <React.Fragment>
        <table className="ui table">
          <thead>
            <tr>
              <th>Value</th>
              <th>Column</th>
            </tr>
          </thead>
          <tbody>


            {Object.keys(this.currentFeature.properties).map((property) => (
              <tr key={property}>
                <td>{this.currentFeature.properties[property]}</td>
                <td>{property}</td>
              </tr>
            ))}

          </tbody>
        </table>

      </React.Fragment>

    ) : null;

  }

};

const mapStateToProps = (state) => {
  return { Features: state.Features, map: state.map.focused };
};

export default connect(mapStateToProps)(FeatureDetail);
