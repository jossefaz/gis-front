import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentFeature } from "../../../../../redux/actions/features";
import "./style.css";
class FeatureList extends Component {
  renderSelectedFeature = () => {
    const { selectedFeatures, currentLayer, currentFeature } = this.props.Features;
    return currentLayer ? selectedFeatures[currentLayer].length > 0 ? (
      selectedFeatures[currentLayer].map((feature) => (

        <tr key={feature.id}>


          <td
            className={
              currentFeature
                ? currentFeature.id == feature.id
                  ? "currentFeature pointerCur"
                  : "pointerCur"
                : "pointerCur"
            }
            onClick={() => this.props.setCurrentFeature(feature.id)}
          >

            {feature.properties.migrash}

          </td>
        </tr>
      ))
    ) : (
        <div>SELECT FIRST ON MAP</div>
      ) : null
  };

  render() {
    return (
      <React.Fragment>
        <table class="ui table">
          <thead>
            <tr>
              <th>Features</th>
            </tr>
          </thead>
          <tbody>

            {this.renderSelectedFeature()}

          </tbody>
        </table>

      </React.Fragment>

    );
  }
}

const mapStateToProps = (state) => {
  return { Features: state.Features };
};

export default connect(mapStateToProps, { setCurrentFeature })(FeatureList);
