import React from "react";
import { connect } from "react-redux";

const FeatureDetail = ({ Feature }) => {
  return Feature ? (
    <React.Fragment>
      <table className="ui table">
        <thead>
          <tr>
            <th>Value</th>
            <th>Column</th>
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

    </React.Fragment>

  ) : null;
};

const mapStateToProps = (state) => {
  return { Feature: state.Features.currentFeature };
};

export default connect(mapStateToProps)(FeatureDetail);
