import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openDrawSession } from "../../../../redux/actions/features";
import { abortDrawingOnEscape } from "../../func";
import "./style.css";
class MeasureDistance extends React.Component {
  componentDidMount() {}
  componentDidUpdate() {
    document.addEventListener("keydown", (evt) => {
      evt = evt || window.event;
      var isEscape = false;
      if ("key" in evt) {
        isEscape = evt.key === "Escape" || evt.key === "Esc";
      } else {
        isEscape = evt.keyCode === 27;
      }
      if (isEscape) {
        this.props.Features.Draw.DrawObject.abortDrawing();
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className=""></div>
        <div className="ui grid">
          <button
            className="ui icon button"
            onClick={() => this.props.openDrawSession("Polygon")}
          >
            <FontAwesomeIcon icon="draw-polygon" size="lg" />
          </button>
          <button
            className="ui icon button"
            onClick={() => this.props.openDrawSession("LineString")}
          >
            <FontAwesomeIcon icon="map-pin" size="lg" />
          </button>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { Features: state.Features };
};

export default connect(mapStateToProps, { openDrawSession })(MeasureDistance);
