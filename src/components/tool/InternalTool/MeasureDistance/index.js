import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getInteractionProxy, getInteraction, getOverlay, removeInteraction, removeOverlay } from '../../../../nessMapping/api'
import { setInteraction } from "../../../../redux/actions/interaction";
import { setOverlay } from "../../../../redux/actions/overlay";
import { generateOutput } from "./func";
import { Confirm } from 'semantic-ui-react'
import "./style.css";
class MeasureDistance extends React.Component {

  WIDGET_NAME = "Measure"
  CLASSNAMES = {
    MEASURE: 'ol-tooltip ol-tooltip-measure',
    HIDDEN: 'hidden',
    FINISH: 'ol-tooltip ol-tooltip-static'
  }

  state = {
    measureMsg: {
      className: this.CLASSNAMES.MEASURE,
      current_uuid: ''
    },
    eraseDraw: {
      openAlert: false,
      content: "האם ברצונך למחוק את כלל המדידות שביצת ?",
      confirmBtn: "כן",
      cancelBtn: "לא"
    }

  }
  sketch = null;



  get map() {
    return this.props.maps.focused
  }
  get selfInteraction() {
    if (this.WIDGET_NAME in this.props.Interactions) {
      return this.props.Interactions[this.WIDGET_NAME]
    }
    return false
  }
  get selfOverlay() {
    if (this.WIDGET_NAME in this.props.Overlays) {
      return this.props.Overlays[this.WIDGET_NAME]
    }
    return false
  }
  get draw() {
    if (this.selfInteraction) {
      return this.selfInteraction[this.map].uuid
    }
  }
  get measureToolTip() {
    return this.selfOverlay ? this.selfOverlay[this.map].focused : null
  }

  get DrawLayer() {
    return this.draw ? getInteractionProxy(this.draw).sourceLayer : null
  }


  createMeasureTooltip = () => {
    const selector = `${this.WIDGET_NAME}${this.map}`
    this.props.setOverlay({
      overlay: {
        element: this.generateOverlayDiv(selector),
        offset: [0, -15],
        positioning: 'bottom-center'
      },
      widgetName: this.WIDGET_NAME,
      selector
    }
    );
  }

  toogleToolTip = (show, finishdraw = null) => {
    const { FINISH, MEASURE, HIDDEN } = this.CLASSNAMES
    const className = finishdraw ? show ? FINISH : show ? MEASURE : HIDDEN : HIDDEN;
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

  addInteraction = async (drawtype) => {
    const sourceLayer = this.DrawLayer // save it before it will be deleted !!
    this.removeDrawObject();
    await this.props.setInteraction({
      Type: "Draw",
      drawConfig: { type: drawtype },
      sourceLayer,
      widgetName: this.WIDGET_NAME
    });
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
            this.setState({ measureMsg: { ...this.state.measureMsg, [this.map]: output, className: this.CLASSNAMES.MEASURE } })
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

  onClearDrawing = () => {
    this.DrawLayer.clear()
    this.setState({ open: false })
    this.selfOverlay[this.map].overlays.map(overlay => removeOverlay(overlay.uuid))
    removeInteraction(this.selfInteraction[this.map].uuid)
  }
  removeDrawObject = (rmOverlay, closeComponent, reset) => {
    if (closeComponent) {
      Object.keys(this.selfInteraction).map(oid => removeInteraction(this.selfInteraction[oid].uuid));

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

  generateOverlayDiv(selector) {
    const overlayDiv = document.createElement("div")
    overlayDiv.setAttribute("id", selector)
    overlayDiv.setAttribute("class", this.CLASSNAMES.MEASURE)
    return overlayDiv;
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
            className="ui icon button pointer"
            onClick={() => this.onOpenDrawSession("Polygon")}
          >
            <FontAwesomeIcon icon="draw-polygon" size="lg" />
          </button>
          <button
            className="ui icon button pointer"
            onClick={() => this.onOpenDrawSession("LineString")}
          >
            <FontAwesomeIcon icon="map-pin" size="lg" />
          </button>
          <button
            className="ui icon button pointer"
            onClick={() => this.setState({ open: true })}
          >
            <FontAwesomeIcon icon="trash-alt" size="lg" />
          </button>
          <Confirm
            open={this.state.open}
            size='mini'
            content={this.state.eraseDraw.content}
            cancelButton={this.state.eraseDraw.cancelBtn}
            confirmButton={this.state.eraseDraw.confirmBtn}
            onCancel={() => this.setState({ ...this.state.eraseDraw, open: false })}
            onConfirm={this.onClearDrawing}
          />
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
    Interactions: state.Interactions,
    Overlays: state.Overlays
  };
};

export default connect(mapStateToProps, { setInteraction, setOverlay })(MeasureDistance);
