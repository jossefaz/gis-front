import React from "react";
import { connect } from "react-redux";

const FeatureDetail = ({ Feature }) => {
  return Feature ? (
    <div className="ui divided list">
      {Object.keys(Feature.properties).map((property) => (
        <div className="item" key={property}>
          <div className="content">
            {property} :{Feature.properties[property]}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div>Select a Feature !</div>
  );
};

const mapStateToProps = (state) => {
  return { Feature: state.Features.currentFeature };
};

export default connect(mapStateToProps)(FeatureDetail);
