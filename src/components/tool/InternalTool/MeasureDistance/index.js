import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addOverlay, addInteraction, getInteraction, getOverlay, removeInteraction, removeOverlay } from '../../../../nessMapping/api'
import { unByKey } from 'ol/Observable';
import { formatArea, formatLength } from '../../../../utils/format'
import { LineString, Polygon } from 'ol/geom';
import "./style.css";
class MeasureDistance extends React.Component {

  state = {
    measureMsg: {
      className: 'ol-tooltip ol-tooltip-measure',
    },
  }

  _measureToolTip = {};
  sketch = null;
  listener = null;
  _draw = {};


  addDrawObjectRef = (uuid) => {
    this._draw[this.props.maps.focused] = uuid
  }
  addMeasureToolTipRef = (uuid) => {
    this._measureToolTip[this.props.maps.focused] = uuid
  }
  get draw() {
    return this._draw[this.props.maps.focused]
  }
  get measureToolTip() {
    return this._measureToolTip[this.props.maps.focused]
  }


  createMeasureTooltip = () => {
    const uuid = addOverlay(
      {
        element: this.generateOverlayDiv(),
        offset: [0, -15],
        positioning: 'bottom-center'
      }
    );
    this.addMeasureToolTipRef(uuid)
  }

  toogleToolTip = (show) => {
    const className = show ? 'ol-tooltip ol-tooltip-measure' : 'hidden';
    this.setState({
      measureMsg: { ...this.state.measureMsg, className }
    })

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
      getInteraction(this.draw).abortDrawing();
      this.toogleToolTip(false)
    }
  }

  onOpenDrawSession = (drawtype) => {
    this.removeDrawObject();
    this.toogleToolTip(true)
    const uuid = addInteraction({ Type: "Draw", drawConfig: { type: drawtype } });
    this.addDrawObjectRef(uuid)
    debugger
    this.createMeasureTooltip();
    this.onDrawStart(this.draw);
    this.onDrawEnd(this.draw);

  }

  onDrawStart = (uuid) => {
    const draw = getInteraction(uuid)
    if (draw) {
      draw.on('drawstart',
        (evt) => {
          // set sketch
          this.sketch = evt.feature
          /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
          let tooltipCoord = evt.coordinate;
          this.listener = this.sketch.getGeometry().on('change', (evt) => {
            const geom = evt.target;
            let output;
            if (geom instanceof Polygon) {
              output = formatArea(geom);
              tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof LineString) {
              output = formatLength(geom);
              tooltipCoord = geom.getLastCoordinate();
            }
            console.log(this.state)
            this.setState({ measureMsg: { ...this.state.measureMsg, [this.props.maps.focused]: output, className: 'ol-tooltip ol-tooltip-measure' } })
            getOverlay(this.measureToolTip).setPosition(tooltipCoord);
          });
        });
    }
  }

  onDrawEnd = (uuid) => {
    const draw = getInteraction(uuid)
    if (draw) {
      draw.on('drawend',
        () => {
          this.toogleToolTip(true)
          getOverlay(this.measureToolTip).setOffset([0, -7]);
        });
      unByKey(this.listener);
    }
  }

  removeDrawObject = (rmOverlay, closeComponent, reset) => {
    if (closeComponent) {
      Object.keys(this._draw).map(oid => removeInteraction(getInteraction(this._draw[oid], oid), oid));
      Object.keys(this._measureToolTip).map(oid => removeOverlay(getOverlay(this._measureToolTip[oid], oid), oid));
    }
    else if (this.draw) {
      removeInteraction(getInteraction(this.draw))
      if (!reset) {
        removeOverlay(getOverlay(this.measureToolTip))
      }
    }
  }



  // LIFECYCLE


  componentDidUpdate() {

    document.addEventListener("keydown", this.escapeHandler);
    if (this.props.Tools.length > 0) {
      this.props.Tools.map(toolid => {
        if (toolid == this.props.toolID) {
          this.onReset()
        }
      })
    }
    // this.addDrawObject()
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escapeHandler);
    this.removeDrawObject(true, true)
  }

  onReset = () => {
    this.renderOverlayDiv();
  }

  generateOverlayDiv() {
    const overlayDiv = document.createElement("div")
    overlayDiv.setAttribute("id", `measureToolTip${this.props.maps.focused}`)
    overlayDiv.setAttribute("class", "ol-tooltip ol-tooltip-measure")
    return overlayDiv;
  }

  renderOverlayDiv() {

    if (this.draw && document.querySelector(`#measureToolTip${this.props.maps.focused}`)) {
      const overlayDiv = document.querySelector(`#measureToolTip${this.props.maps.focused}`)
      overlayDiv.innerHTML = this.state.measureMsg[this.props.maps.focused]
      overlayDiv.className = this.state.measureMsg.className
    }
  }

  render() {
    this.renderOverlayDiv();
    return (
      <React.Fragment>
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
    maps: state.map,
    Tools: state.Tools.reset
  };
};

export default connect(mapStateToProps)(MeasureDistance);
