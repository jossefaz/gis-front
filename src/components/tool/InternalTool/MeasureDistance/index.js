import React from "react";
import { connect } from "react-redux";
import { getInteraction, getOverlay, getInteractionGraphicLayer, getInteractionVectorSource } from '../../../../nessMapping/api'
import { setInteraction, unsetInteraction } from "../../../../redux/actions/interaction";
import { setOverlay, unsetOverlays, unsetOverlay } from "../../../../redux/actions/overlay";
import IconButton from "../../../UI/Buttons/IconButton"
import { generateOutput, generateNewStyle } from "./func";
import { Confirm } from 'semantic-ui-react'
import "./style.css";
class MeasureDistance extends React.Component {

  WIDGET_NAME = "Measure"
  CLASSNAMES = {
    MEASURE: 'ol-tooltip ol-tooltip-measure',
    HIDDEN: 'hidden',
    FINISH: 'ol-tooltip ol-tooltip-static'
  }
  INTERACTIONS = {
    Draw: "Draw"
  }

  state = {
    measureMsg: {
      className: this.CLASSNAMES.MEASURE,
      current_uuid: ''
    },
    eraseDraw: {
      openAlert: false,
      content: "? האם ברצונך למחוק את כלל המדידות שביצת",
      confirmBtn: "כן",
      cancelBtn: "לא"
    },
    view: true

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
    if (this.selfInteraction && this.map in this.selfInteraction && this.INTERACTIONS.Draw in this.selfInteraction[this.map]) {
      return this.selfInteraction[this.map][this.INTERACTIONS.Draw].uuid
    }
    return false
  }
  get measureToolTip() {
    return this.selfOverlay && this.map in this.selfOverlay ? this.selfOverlay[this.map].focused : null
  }

  get DrawLayer() {
    return this.draw ? getInteractionGraphicLayer(this.draw) : null
  }

  get DrawSource() {
    return this.draw ? getInteractionVectorSource(this.draw) : null
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

  ToggleOverlays = (show) => {
    if (this.selfOverlay && this.map in this.selfOverlay) {
      console.log(this.selfOverlay)
      Object.keys(this.selfOverlay[this.map].overlays).map(
        overlay => {
          const selector = this.selfOverlay[this.map].overlays[overlay].selector
          const overlayDiv = document.querySelector(`#${selector}`)
          overlayDiv.className = show ? this.CLASSNAMES.FINISH : this.CLASSNAMES.HIDDEN
        }
      )
    }
  }

  toogleView = () => {
    if (this.DrawLayer) {
      this.DrawLayer.setVisible(!this.state.view)
    }
    if (this.selfOverlay) {
      this.ToggleOverlays(!this.state.view)
    }
    this.setState({
      view: !this.state.view
    })
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
      this.abortDrawing();
      this.toogleToolTip(false)
    }
  }

  addInteraction = async (drawtype) => {
    const sourceLayer = this.DrawSource // save it before it will be deleted !!
    const Layer = this.DrawLayer
    this.removeDrawObject();
    await this.props.setInteraction({
      Type: "Draw",
      drawConfig: { type: drawtype },
      sourceLayer,
      Layer,
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
          const features = this.DrawSource.getFeatures()
          if (features.length > 0) {
            features[features.length - 1].setStyle(generateNewStyle())
          }

        });

    }
  }

  onClearDrawing = async () => {
    this.DrawSource.clear()
    this.setState({ open: false })
    await this.removeDrawObject()
    await this.removeOverlays()
  }
  removeDrawObject = async () => {
    if (this.selfInteraction && this.map in this.selfInteraction && this.INTERACTIONS.Draw in this.selfInteraction[this.map]) {
      this.props.unsetInteraction({ uuid: this.selfInteraction[this.map][this.INTERACTIONS.Draw].uuid, widgetName: this.WIDGET_NAME, Type: this.INTERACTIONS.Draw })
    }

  }
  removeOverlays = async () => {
    if (this.selfOverlay) {
      this.props.unsetOverlays({ overlays: this.selfOverlay[this.map].overlays, widgetName: this.WIDGET_NAME })
    }

  }

  abortDrawing = () => {
    if (this.draw) {
      getInteraction(this.draw).abortDrawing();
    }
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



  // LIFECYCLE
  componentDidUpdate() {
    document.addEventListener("keydown", this.escapeHandler);
    if (this.props.Tools.unfocus == this.props.toolID) {
      this.onUnfocus()
    }
    if (this.props.Tools.reset.length > 0) {
      this.props.Tools.reset.map(toolid => {
        if (toolid == this.props.toolID) {
          this.onReset()
        }
      })
    }
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escapeHandler);
    if (this.draw) {
      this.removeDrawObject()
    }
    this.onReset();
  }
  onReset = () => {
    if (this.selfOverlay && this.map && this.map in this.selfOverlay && this.measureToolTip in this.selfOverlay[this.map].overlays) {
      this.props.unsetOverlay({ uuid: this.measureToolTip, widgetName: this.WIDGET_NAME })
    }
    this.abortDrawing();
  }
  onUnfocus = () => {
    this.onReset();
    if (this.draw) {
      this.removeDrawObject()
    }
  }



  render() {
    this.renderOverlayDiv();
    return (
      <React.Fragment>
        <div className="ui grid">
          <IconButton
            className="ui icon button primary pointer"
            onClick={() => this.onOpenDrawSession("Polygon")}
            icon="draw-polygon" size="lg" />
          <IconButton
            className="ui icon button primary pointer"
            onClick={() => this.onOpenDrawSession("LineString")}
            icon="ruler" size="lg" />
          <IconButton
            className={`ui icon button pointer ${this.DrawSource && this.DrawSource.getFeatures().length > 0 ? 'negative' : 'disabled'}`}
            onClick={() => this.setState({ open: true })}
            disabled={!this.DrawLayer}
            icon="trash-alt" size="lg" />
          <IconButton
            className={`ui icon button pointer ${this.DrawSource && this.DrawSource.getFeatures().length > 0 ? 'positive' : 'disabled'}`}
            onClick={() => this.toogleView()}
            disabled={!this.DrawLayer}
            icon={this.state.view ? 'eye' : 'eye-slash'} size="lg" />
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
    Tools: state.Tools,
    Interactions: state.Interactions,
    Overlays: state.Overlays
  };
};

export default connect(mapStateToProps, { setInteraction, unsetInteraction, setOverlay, unsetOverlays, unsetOverlay })(MeasureDistance);
