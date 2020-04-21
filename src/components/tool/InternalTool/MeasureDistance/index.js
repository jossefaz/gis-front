import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openDrawSession } from "../../../../redux/actions/features";
import "./style.css";
const MeasureDistance = (props) => {
  return (
    <div className="ui grid">
      <button
        className="ui icon button"
        onClick={() => props.openDrawSession("Polygon")}
      >
        <FontAwesomeIcon icon="draw-polygon" size="lg" />
      </button>
      <button
        className="ui icon button"
        onClick={() => props.openDrawSession("LineString")}
      >
        <FontAwesomeIcon icon="map-pin" size="lg" />
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { Features: state.Features };
};

export default connect(mapStateToProps, { openDrawSession })(MeasureDistance);
