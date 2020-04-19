import React from "react";
import { connect } from "react-redux";
import "./style.css";
const Identify = (props) => {
  const renderSelectedFeature = () => {
    return props.Features.selectedFeatures ? (
      props.Features.selectedFeatures.map((feature) => (
        <div key={feature.id}>
          <p>{feature.properties.migrash}</p>
        </div>
      ))
    ) : (
      <div>SELECT FIRST ON MAP</div>
    );
  };
  return <div className="ui grid">{renderSelectedFeature()}</div>;
};

const mapStateToProps = (state) => {
  return { Features: state.Features };
};

export default connect(mapStateToProps, null)(Identify);
