import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";
const MeasureDistance = (props) => {
  return (
    <div className="ui grid">
      <button class="ui icon button">
        <FontAwesomeIcon icon="draw-polygon" size="lg" />
      </button>
      <button class="ui icon button">
        <FontAwesomeIcon icon="map-pin" size="lg" />
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { Features: state.Features };
};

export default connect(mapStateToProps)(MeasureDistance);
