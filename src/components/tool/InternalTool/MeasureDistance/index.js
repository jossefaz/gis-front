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

    continuePolygonMsg: 'Click to continue drawing the polygon',
    continueLineMsg: 'Click to continue drawing the line',
    measureMsg: {
      message: "",
      className: 'ol-tooltip ol-tooltip-measure',
      uuid: ''
    },
    drawObject: null


  }

  measureTooltip = null;
  DrawObject = null;
  sketch = null;
  listener = null;



  componentDidMount() {
    this.createMeasureTooltip();

  }

  createMeasureTooltip = () => {
    const uuid = addOverlay(
      {
        element: document.getElementById('measureTooltip'),
        offset: [0, -15],
        positioning: 'bottom-center'
      }
    );
    this.setState({ measureMsg: { ...this.state.measureMsg, uuid } });
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
      const draw = getInteraction(this.state.drawObject)
      if (draw) {
        draw.abortDrawing();
      }
    }
  }

  onOpenDrawSession = (drawtype) => {
    this.removeDrawObject()
    const uuid = addInteraction({ Type: "Draw", drawConfig: { type: drawtype } })
    this.setState({ drawObject: uuid });
    this.onDrawStart(uuid);
    this.onDrawEnd(uuid);

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
            this.setState({ measureMsg: { ...this.state.measureMsg, message: output } })
            getOverlay(this.state.measureMsg.uuid).setPosition(tooltipCoord);
          });
        });
    }
  }

  onDrawEnd = (uuid) => {
    const draw = getInteraction(uuid)
    if (draw) {
      draw.on('drawend',
        () => {
          this.setState({
            measureMsg: { ...this.state.measureMsg, className: 'ol-tooltip ol-tooltip-static' }
          })
          getOverlay(this.state.measureMsg.uuid).setOffset([0, -7]);
        });
      unByKey(this.listener);
    }
  }

  removeDrawObject = () => {
    if (this.state.drawObject) {
      removeInteraction(getInteraction(this.state.drawObject))
      removeOverlay(getOverlay(this.state.measureMsg.uuid));
      this.setState({
        measureMsg: { ...this.state.measureMsg, className: 'ol-tooltip ol-tooltip-static hidden' }
      })
    }
  }


  componentDidUpdate() {
    document.addEventListener("keydown", this.escapeHandler);
    // this.addDrawObject()
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escapeHandler);
    this.removeDrawObject()
  }

  render() {
    return (
      <React.Fragment>
        <div className={this.state.measureMsg.className} id="measureTooltip">{this.state.measureMsg.message}</div>
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

export default connect(mapStateToProps)(MeasureDistance);
