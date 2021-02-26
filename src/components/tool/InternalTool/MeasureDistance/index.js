import React from "react";
import { connect } from "react-redux";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import { getOverlay, getFocusedMap } from "../../../../core/api";
import IconButton from "../../../UI/Buttons/IconButton";
import { generateOutput, generateNewStyle } from "./func";
import { DragPan } from "ol/interaction";
import { Confirm } from "semantic-ui-react";
import { random_rgba } from "../../../../utils/func";
import { InteractionUtil } from "../../../../utils/interactions";
import { OverlayUtil } from "../../../../utils/overlay";
import "./style.css";
class MeasureDistance extends React.Component {
  WIDGET_NAME = "Measure";
  CLASSNAMES = {
    MEASURE: "ol-tooltip ol-tooltip-measure",
    HIDDEN: "hidden",
    FINISH: "ol-tooltip ol-tooltip-static",
  };
  INTERACTIONS = {
    Draw: "Draw",
  };

  constructor() {
    super();
    this.state = {
      measureMsg: {
        className: this.CLASSNAMES.MEASURE,
        current_uuid: "",
      },
      eraseDraw: {
        openAlert: false,
        content: "? האם ברצונך למחוק את כלל המדידות שביצעת",
        confirmBtn: "כן",
        cancelBtn: "לא",
      },
      view: true,
    };
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
    this.overlays = new OverlayUtil(this.WIDGET_NAME);
  }
  sketch = null;

  get map() {
    return this.props.maps.focused;
  }
  get selfInteraction() {
    return this.interactions.store;
  }

  get overlayHealthCheck() {
    return (
      this.selfOverlay &&
      this.map &&
      this.map in this.selfOverlay &&
      this.selfOverlay[this.map].overlays
    );
  }
  get selfOverlay() {
    return this.overlays.store;
  }
  get draw() {
    return this.interactions.currentDraw;
  }

  get DrawLayer() {
    return this.interactions.getVectorLayer(this.interactions.TYPES.DRAW);
  }

  get DrawSource() {
    return this.interactions.getVectorSource(this.interactions.TYPES.DRAW);
  }

  createMeasureTooltip = () => {
    this.overlays.newText();
  };

  toogleView = () => {
    this.DrawLayer.setVisible(!this.state.view);
    this.overlays.toggleAll();
    this.setState({
      view: !this.state.view,
    });
  };

  toogleToolTip = (show, finishdraw = null) => {
    const { FINISH, MEASURE, HIDDEN } = this.CLASSNAMES;
    const className = finishdraw
      ? show
        ? FINISH
        : show
        ? MEASURE
        : HIDDEN
      : HIDDEN;
    this.setState({
      measureMsg: { ...this.state.measureMsg, className },
    });
  };

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
      this.toogleToolTip(false);
    }
  };

  addInteraction = async (drawtype) => {
    await this.interactions.newDraw({ type: drawtype });
  };

  onOpenDrawSession = async (drawtype) => {
    await this.addInteraction(drawtype);
    this.createMeasureTooltip();
    this.toogleToolTip(true);
    this.onDrawStart();
    this.onDrawEnd();
  };
  onDrawStart = () => {
    const draw = this.interactions.currentDraw;
    if (draw) {
      draw.on("drawstart", (evt) => {
        this.sketch = evt.feature;
        let coord = evt.coordinate;
        this.sketch.getGeometry().on("change", (evt) => {
          const { output, tooltipCoord } = generateOutput(evt, coord);
          this.setState({
            measureMsg: {
              ...this.state.measureMsg,
              [this.map]: output,
              className: this.CLASSNAMES.MEASURE,
            },
          });
          getOverlay(this.overlays.focused).setPosition(tooltipCoord);
        });
      });
    }
  };
  onDrawEnd = () => {
    const draw = this.interactions.currentDraw;
    if (draw) {
      draw.on("drawend", (e) => {
        this.toogleToolTip(true, true);
        getOverlay(this.overlays.focused).setOffset([0, -7]);
        const color = random_rgba();
        this.overlays.addDraggable(this.overlays.focused, color);
        e.feature.setStyle(generateNewStyle(color));
        this.createMeasureTooltip();
      });
    }
  };

  onClearDrawing = async () => {
    this.DrawSource.clear();
    this.setState({ open: false });
    await this.interactions.unDraw();
    await this.overlays.unsetAll();
  };

  abortDrawing = () => {
    if (this.draw) {
      this.interactions.currentDraw.abortDrawing();
    }
  };

  renderOverlayDiv() {
    this.overlays.edit(
      this.overlays.focused,
      this.state.measureMsg[this.map],
      this.state.measureMsg.className
    );
  }

  // LIFECYCLE

  componentDidMount() {
    getFocusedMap()
      .getInteractions()
      .forEach((interaction) => {
        if (interaction instanceof DragPan) {
          this.dragPan = interaction;
        }
      });
    getFocusedMap().on("pointermove", (evt) => {
      this.overlays.dragOverlay(evt, () => this.dragPan.setActive(false));
    });
    getFocusedMap().on("pointerup", (evt) => {
      this.overlays.unDragOverlay(() => this.dragPan.setActive(false));
    });
  }

  componentDidUpdate() {
    document.addEventListener("keydown", this.escapeHandler);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escapeHandler);
    getFocusedMap().un("pointermove", this.dragOverlay);
    getFocusedMap().un("pointerup", this.unDragOverlay);
    this.onReset();
  }
  onReset = () => {
    this.overlays.unset(this.overlays.focused);
    this.abortDrawing();
    this.interactions.unDraw();
  };
  onUnfocus = () => {
    this.onReset();
  };

  render() {
    this.renderOverlayDiv();
    return (
      <React.Fragment>
        <div className="ui grid">
          <IconButton
            className="ui icon button primary pointer"
            onClick={() => this.onOpenDrawSession("Polygon")}
            icon="draw-polygon"
            size="lg"
          />
          <IconButton
            className="ui icon button primary pointer"
            onClick={() => this.onOpenDrawSession("LineString")}
            icon="ruler"
            size="lg"
          />
          <IconButton
            className="ui icon button primary pointer"
            onClick={() => this.onOpenDrawSession("Circle")}
            icon="circle"
            size="lg"
          />
          <IconButton
            className={`ui icon button pointer ${
              this.DrawSource && this.DrawSource.getFeatures().length > 0
                ? "negative"
                : "disabled"
            }`}
            onClick={() => this.setState({ open: true })}
            disabled={!this.DrawLayer}
            icon="trash-alt"
            size="lg"
          />
          <IconButton
            className={`ui icon button pointer ${
              this.DrawSource && this.DrawSource.getFeatures().length > 0
                ? "positive"
                : "disabled"
            }`}
            onClick={() => this.toogleView()}
            disabled={!this.DrawLayer}
            icon={this.state.view ? "eye" : "eye-slash"}
            size="lg"
          />
          <Confirm
            open={this.state.open}
            size="mini"
            content={this.state.eraseDraw.content}
            cancelButton={this.state.eraseDraw.cancelBtn}
            confirmButton={this.state.eraseDraw.confirmBtn}
            onCancel={() =>
              this.setState({ ...this.state.eraseDraw, open: false })
            }
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
    Interactions: state.Interactions,
    Overlays: state.Overlays,
  };
};

export default connect(mapStateToProps)(withWidgetLifeCycle(MeasureDistance));
