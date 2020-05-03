import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openDrawSession, closeDrawSession } from "../../../../redux/actions/features";
import NessMapping from "../../../../nessMapping/mapping";
import "./style.css";
class MeasureDistance extends React.Component {
  helpTooltip = null;
  measureTooltip = null;
  componentDidMount() {

    this.DrawObject = this.props.Features.Draw.DrawObject


  }



  escapeHandler = (evt) => {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
      isEscape = evt.key === "Escape" || evt.key === "Esc";
    } else {
      isEscape = evt.keyCode === 27;
    }
    if (isEscape) {
      this.DrawObject.abortDrawing();
    }
  }

  onOpenDrawSession = (drawtype) => {
    this.removeDrawObject();
    this.props.openDrawSession(drawtype)

  }

  removeDrawObject = () => {
    if (this.DrawObject) {
      NessMapping.getInstance().getFocusedMap().removeInteraction(this.props.Features.Draw.DrawObject);
    }
  }
  addDrawObject = () => {
    if (this.DrawObject) {
      NessMapping.getInstance().getFocusedMap().addInteraction(this.DrawObject);
    }
  }


  componentDidUpdate() {
    this.DrawObject = this.props.Features.Draw.DrawObject
    document.addEventListener("keydown", this.escapeHandler);
    this.addDrawObject()
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escapeHandler);
    this.removeDrawObject()
    this.props.closeDrawSession()
  }

  render() {
    return (
      <React.Fragment>
        <div className="ol-tooltip hidden" id="helpTooltip"></div>
        <div className="ol-tooltip ol-tooltip-measure" id="measureTooltip"></div>
        <div className="ui grid">
          <button
            className="ui icon button"
            onClick={() => this.onOpenDrawSession("Polygon")}
          >
            <FontAwesomeIcon icon="draw-polygon" size="lg" />
          </button>
          <button
            className="ui icon button"
            onClick={() => this.onOpenDrawSession("LineString")}
          >
            <FontAwesomeIcon icon="map-pin" size="lg" />
          </button>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    Features: state.Features,
    maps: state.map
  };
};

export default connect(mapStateToProps, { openDrawSession, closeDrawSession })(MeasureDistance);
