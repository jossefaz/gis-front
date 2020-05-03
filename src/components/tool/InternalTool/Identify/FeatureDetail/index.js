import React from "react";
import { connect } from "react-redux";

const FeatureDetail = ({ Feature }) => {
  return Feature ? (
    <table className="ui very basic collapsing celled table">
      <thead>
        <tr>
          <th>Value</th>
          <th>Property</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(Feature.properties).map((property) => (
          <tr key={property}>
            <td>{Feature.properties[property]}</td>
            <td>{property}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div>Select a Feature !</div>
  );
};

const mapStateToProps = (state) => {
  return { Feature: state.Features.currentFeature };
};

export default connect(mapStateToProps)(FeatureDetail);
