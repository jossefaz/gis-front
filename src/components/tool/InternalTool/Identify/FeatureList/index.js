import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentFeature } from "../../../../../redux/actions/features";
import "./style.css";
class FeatureList extends Component {
  renderSelectedFeature = () => {
    const { selectedFeatures, currentLayer, currentFeature } = this.props.Features;
    return currentLayer ? selectedFeatures[currentLayer].length > 0 ? (
      selectedFeatures[currentLayer].map((feature) => (
        <div className="item" key={feature.id}>
          <div
            className="content pointerCur"
            onClick={() => this.props.setCurrentFeature(feature.id)}
          >
            <p
              className={
                currentFeature
                  ? currentFeature.id == feature.id
                    ? "currentFeature"
                    : ""
                  : ""
              }
            >
              {feature.properties.migrash}
            </p>
          </div>
        </div>
      ))
    ) : (
        <div>SELECT FIRST ON MAP</div>
      ) : null
  };

  render() {
    return (
      <div className="ui divided list">{this.renderSelectedFeature()}</div>
    );
  }
}

const mapStateToProps = (state) => {
  return { Features: state.Features };
};

export default connect(mapStateToProps, { setCurrentFeature })(FeatureList);
