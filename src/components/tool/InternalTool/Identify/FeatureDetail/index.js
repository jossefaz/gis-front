import React from "react";
import { connect } from "react-redux";

class FeatureDetail extends React.Component {
  focusedmap = this.props.focusedmap
  sanityCheck = () => {
    return this.focusedmap in this.props.Features &&
      "currentFeature" in this.props.Features[this.focusedmap] &&
      this.props.Features[this.focusedmap].currentFeature
  }
  get currentFeature() {
    return this.sanityCheck ? this.props.Features[this.focusedmap].currentFeature : null
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
  return { Features: state.Features };
};

export default connect(mapStateToProps)(FeatureDetail);
