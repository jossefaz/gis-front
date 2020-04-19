import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentFeature } from "../../../../../redux/actions/features";
import "./style.css";
class FeatureList extends Component {
  renderSelectedFeature = () => {
    const { selectedFeatures, currentFeature } = this.props.Features;
    return selectedFeatures ? (
      selectedFeatures.length > 0 ? (
        selectedFeatures.map((feature) => (
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
      )
    ) : (
      <div>SELECT FIRST ON MAP</div>
    );
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
