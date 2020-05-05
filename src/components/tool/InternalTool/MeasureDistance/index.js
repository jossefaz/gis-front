import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addOverlay, addInteraction, getInteraction, getOverlay, removeInteraction, removeOverlay, getFocusedMap } from '../../../../nessMapping/api'
import { setInteraction } from "../../../../redux/actions/interaction";
import { generateOutput } from "./func";
import "./style.css";
class MeasureDistance extends React.Component {

  state = {
    measureMsg: {
      className: 'ol-tooltip ol-tooltip-measure',
      current_uuid: ''
    },
  }

  _measureToolTip = {};
  sketch = null;
  listener = null;
  WIDGET_NAME = "Measure"

  addMeasureToolTipRef = (uuid) => {
    const mapfocused = this.map
    if (!(mapfocused in this._measureToolTip)) {
      this._measureToolTip[mapfocused] = []
    }
    this._measureToolTip[mapfocused].push(uuid)
  }
  get map() {
    return this.props.maps.focused
  }
  get selfInteraction() {
    if (this.WIDGET_NAME in this.props.Interactions) {
      return this.props.Interactions[this.WIDGET_NAME]
    }
    return false
  }
  get draw() {
    if (this.selfInteraction) {
      return this.selfInteraction[this.map].uuid
    }
  }
  get measureToolTip() {
    return this.map in this._measureToolTip ? this._measureToolTip[this.map].filter(uuid => uuid == this.state.measureMsg.current_uuid)[0] : null
  }


  createMeasureTooltip = () => {
    const uuid = addOverlay(
      {
        element: this.generateOverlayDiv(),
        offset: [0, -15],
        positioning: 'bottom-center'
      }
    );
    this.setUUIDtoOverlay(this.map, uuid)
    this.addMeasureToolTipRef(uuid)
    this.setState({
      measureMsg: { ...this.state.measureMsg, current_uuid: uuid }
    })
  }

  toogleToolTip = (show, finishdraw = null) => {
    const className =
      finishdraw ?
        show ?
          'ol-tooltip ol-tooltip-static' :
          show ?
            'ol-tooltip ol-tooltip-measure' : 'hidden'
        : 'hidden';
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

  retrieveDrawLayer = () => {
    return this.draw ? getInteraction(this.draw).sourceLayer : null
  }

  addInteraction = async (drawtype) => {
    const DrawLayer = this.retrieveDrawLayer()
    this.removeDrawObject();
    await this.props.setInteraction({ Type: "Draw", drawConfig: { type: drawtype }, sourceLayer: DrawLayer, widgetName: this.WIDGET_NAME });
  }

  onOpenDrawSession = async (drawtype) => {
    await this.addInteraction(drawtype)
    this.createMeasureTooltip();
    this.toogleToolTip(true)
    this.onDrawStart();
    this.onDrawEnd();
  }

  onDrawStart = () => {
    const draw = getInteraction(this.draw)
    if (draw) {
      draw.on('drawstart',
        (evt) => {
          this.sketch = evt.feature
          let coord = evt.coordinate;
          this.sketch.getGeometry().on('change', (evt) => {
            const { output, tooltipCoord } = generateOutput(evt, coord)
            this.setState({ measureMsg: { ...this.state.measureMsg, [this.map]: output, className: 'ol-tooltip ol-tooltip-measure' } })
            getOverlay(this.measureToolTip).setPosition(tooltipCoord);
          });
        });
    }
  }

  onDrawEnd = () => {
    const draw = getInteraction(this.draw)
    if (draw) {
      draw.on('drawend',
        () => {
          this.toogleToolTip(true, true)
          getOverlay(this.measureToolTip).setOffset([0, -7]);
          this.createMeasureTooltip();
        });

    }
  }

  removeDrawObject = (rmOverlay, closeComponent, reset) => {
    if (closeComponent) {
      Object.keys(this.selfInteraction).map(oid => removeInteraction(this.selfInteraction[oid].uuid));
      Object.keys(this._measureToolTip).map(oid => removeOverlay(getOverlay(this._measureToolTip[oid], oid), oid));
    }
    else if (this.draw) {
      removeInteraction(this.draw)
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
    overlayDiv.setAttribute("id", `${this.WIDGET_NAME}${this.map}`)
    overlayDiv.setAttribute("class", "ol-tooltip ol-tooltip-measure")
    return overlayDiv;
  }

  setUUIDtoOverlay(previd, nextid) {
    const overlayDiv = document.querySelector(`#${this.WIDGET_NAME}${previd}`)
    overlayDiv.setAttribute("id", `${this.WIDGET_NAME}${nextid}`)
  }

  renderOverlayDiv() {
    if (this.draw && document.querySelector(`#${this.WIDGET_NAME}${this.measureToolTip}`)) {
      const overlayDiv = document.querySelector(`#${this.WIDGET_NAME}${this.measureToolTip}`)
      overlayDiv.innerHTML = this.state.measureMsg[this.map]
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
    Tools: state.Tools.reset,
    Interactions: state.Interactions

  };
};

export default connect(mapStateToProps, { setInteraction })(MeasureDistance);
