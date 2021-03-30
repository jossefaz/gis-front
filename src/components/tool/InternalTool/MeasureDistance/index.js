import React from "react";
import { connect } from "react-redux";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import API from "../../../../core/api";
import IconButton from "../../../UI/Buttons/IconButton";
import { generateOutput, generateNewStyle } from "./func";
import { DragPan } from "ol/interaction";
import Confirm from "../../../UI/Modal/Confirm";
import { random_rgba } from "../../../../utils/func";
import { InteractionUtil } from "../../../../utils/interactions";
import { OverlayUtil } from "../../../../utils/overlay";
import "./style.css";
import { InteractionSupportedTypes as TYPES } from "../../../../core/types/interaction";
const { getFocusedMap } = API.map;
const { getOverlay } = API.overlays;

class MeasureDistance extends React.Component {
  WIDGET_NAME = "Measure";
  CLASSNAMES = {
    MEASURE: "ol-tooltip ol-tooltip-measure",
    HIDDEN: "ol-tooltip ol-tooltip-measure",
    FINISH: "ol-tooltip ol-tooltip-static",
  };
  INTERACTIONS = {
    Draw: "Draw",
  };
  TXT = {
    content: "? האם ברצונך למחוק את כלל המדידות שביצעת",
    confirmBtn: "כן",
    cancelBtn: "לא",
  };

  state = {
    measureMsg: {
      className: this.CLASSNAMES.MEASURE,
      current_uuid: "",
    },
    openAlert: false,
    visible: true,
  };
  interactions = new InteractionUtil(this.WIDGET_NAME);
  overlays = new OverlayUtil(this.WIDGET_NAME);

  sketch = null;

  get map() {
    return this.props.maps.focused;
  }
  get draw() {
    return this.interactions.currentDraw;
  }

  get DrawLayer() {
    return this.interactions.getVectorLayer(TYPES.DRAW);
  }

  get DrawSource() {
    return this.interactions.getVectorSource(TYPES.DRAW);
  }

  createMeasureTooltip = () => {
    this.overlays.newText();
  };

  toogleView = () => {
    this.DrawLayer.setVisible(!this.state.visible);
    this.overlays.toggleAll();
    this.setState({
      visible: !this.state.visible,
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
      this.interactions.unDraw();
      this.toogleToolTip(false);
    }
  };

  addInteraction = (drawtype) => {
    this.interactions.newDraw({ type: drawtype });
  };

  onOpenDrawSession = (drawtype) => {
    this.addInteraction(drawtype);
    this.createMeasureTooltip();
    this.toogleToolTip(true);
    this.onDrawStart();
    this.onDrawEnd();
  };

  changeSketchHandler = () => {
    this.sketch &&
      this.sketch.getGeometry().on("change", (evt) => {
        const { output, tooltipCoord } = generateOutput(evt);
        this.setState(
          {
            measureMsg: {
              ...this.state.measureMsg,
              [this.map]: output,
              className: this.CLASSNAMES.MEASURE,
            },
          },
          () => {
            this.renderOverlayDiv(false);
            const current = getOverlay(this.overlays.focused);
            debugger;
            current.setPosition(tooltipCoord);
          }
        );
      });
  };

  onDrawStart = () => {
    const draw = this.interactions.currentDraw;
    if (draw) {
      draw.on("drawstart", (evt) => {
        this.sketch = evt.feature;
        this.changeSketchHandler();
      });
    }
  };
  onDrawEnd = () => {
    const draw = this.interactions.currentDraw;
    if (draw) {
      draw.on("drawend", (e) => {
        this.toogleToolTip(true, true);
        this.renderOverlayDiv(true);
        getOverlay(this.overlays.focused).setOffset([0, -7]);
        const color = random_rgba();
        this.overlays.addDraggable(this.overlays.focused, color);
        e.feature.setStyle(generateNewStyle(color));
        this.createMeasureTooltip();
      });
    }
  };

  onClearDrawing = () => {
    this.DrawSource.clear();
    this.setState({ openAlert: false });
    this.interactions.unDraw();
    this.overlays.unsetAll();
  };

  abortDrawing = () => {
    if (this.draw) {
      this.interactions.currentDraw.abortDrawing();
    }
  };

  renderOverlayDiv(saveToStore) {
    this.overlays.edit(
      this.overlays.focused,
      this.state.measureMsg[this.map],
      this.state.measureMsg.className,
      saveToStore
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
    getFocusedMap().un("pointermove", this.overlays.dragOverlay);
    getFocusedMap().un("pointerup", this.overlays.unDragOverlay);
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
            onClick={() => this.setState({ openAlert: true })}
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
            icon={this.state.visible ? "eye" : "eye-slash"}
            size="lg"
          />
          <Confirm
            isOpen={this.state.openAlert}
            size="mini"
            confirmTxt={this.TXT.content}
            cancelBtnTxt={this.TXT.cancelBtn}
            confirmBtnTxt={this.TXT.confirmBtn}
            onCancel={() => this.setState({ openAlert: false })}
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
