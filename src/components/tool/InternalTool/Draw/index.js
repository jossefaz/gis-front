import React from "react";
import { connect } from "react-redux";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import {
  getInteraction,
  getInteractionGraphicLayer,
  getInteractionVectorSource,
} from "../../../../nessMapping/api";
import {
  setInteraction,
  unsetInteraction,
  unsetInteractions,
} from "../../../../redux/actions/interaction";
import {
  setOverlay,
  unsetOverlays,
  unsetOverlay,
} from "../../../../redux/actions/overlay";
import IconButton from "../../../UI/Buttons/IconButton";
import { unsetUnfocused } from "../../../../redux/actions/tools";
import { generateNewStyle } from "../MeasureDistance/func";
import { Confirm } from "semantic-ui-react";
import "./style.css";
class Draw extends React.Component {
  WIDGET_NAME = "Draw";
  INTERACTIONS = {
    Draw: "Draw",
    Select: "Select",
    Modify: "Modify",
  };
  state = {
    eraseDraw: {
      openAlert: false,
      content: "? האם ברצונך למחוק את כלל המדידות שביצעת",
      confirmBtn: "כן",
      cancelBtn: "לא",
    },
    view: true,
    drawn: false,
  };

  get map() {
    return this.props.maps.focused;
  }

  get selfInteraction() {
    if (this.WIDGET_NAME in this.props.Interactions) {
      return this.props.Interactions[this.WIDGET_NAME];
    }
    return false;
  }

  get draw() {
    if (
      this.selfInteraction &&
      this.map in this.selfInteraction &&
      this.INTERACTIONS.Draw in this.selfInteraction[this.map]
    ) {
      return this.selfInteraction[this.map][this.INTERACTIONS.Draw].uuid;
    }
    return false;
  }

  get select() {
    if (
      this.selfInteraction &&
      this.map in this.selfInteraction &&
      this.INTERACTIONS.Select in this.selfInteraction[this.map]
    ) {
      return this.selfInteraction[this.map][this.INTERACTIONS.Select].uuid;
    }
    return false;
  }

  get modify() {
    this.getSelfInteraction(this.INTERACTIONS.Modify);
  }
  getSelfInteraction = (interaction) => {
    if (
      this.selfInteraction &&
      this.map in this.selfInteraction &&
      interaction in this.selfInteraction[this.map]
    ) {
      return this.selfInteraction[this.map][interaction].uuid;
    }
    return false;
  };

  get DrawLayer() {
    return this.draw ? getInteractionGraphicLayer(this.draw) : null;
  }

  get DrawSource() {
    return this.draw ? getInteractionVectorSource(this.draw) : null;
  }

  toogleView = () => {
    if (this.DrawLayer) {
      this.DrawLayer.setVisible(!this.state.view);
    }
    this.setState({
      view: !this.state.view,
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
    }
  };

  addInteraction = async (drawtype) => {
    const sourceLayer = this.DrawSource; // save it before it will be deleted !!
    const Layer = this.DrawLayer;
    this.removeDrawObject();
    await this.props.setInteraction({
      Type: "Draw",
      drawConfig: { type: drawtype },
      sourceLayer,
      Layer,
      widgetName: this.WIDGET_NAME,
    });
  };

  onOpenDrawSession = async (drawtype) => {
    await this.addInteraction(drawtype);
    this.onDrawEnd();
  };

  onOpenEditSession = async () => {
    this.removeDrawObject();
    await this.props.setInteraction({
      Type: this.INTERACTIONS.Select,
      interactionConfig: {
        wrapX: false,
        layers: [this.DrawLayer],
      },
      widgetName: this.WIDGET_NAME,
    });
    await this.props.setInteraction({
      Type: this.INTERACTIONS.Modify,
      interactionConfig: {
        features: getInteraction(this.select).getFeatures(),
      },
      widgetName: this.WIDGET_NAME,
    });
  };

  onClearDrawing = () => {
    this.DrawSource.clear();
    this.setState({ open: false, drawn: false });
    this.removeDrawObject();
  };
  removeDrawObject = () => {
    if (
      this.draw &&
      this.selfInteraction &&
      this.map in this.selfInteraction &&
      this.INTERACTIONS.Draw in this.selfInteraction[this.map]
    ) {
      this.props.unsetInteraction({
        uuid: this.selfInteraction[this.map][this.INTERACTIONS.Draw].uuid,
        widgetName: this.WIDGET_NAME,
        Type: this.INTERACTIONS.Draw,
      });
    }
  };

  removeSelectAndEdit = () => {
    if (
      this.select &&
      this.modify &&
      this.selfInteraction &&
      this.map in this.selfInteraction &&
      this.INTERACTIONS.select in this.selfInteraction[this.map] &&
      this.INTERACTIONS.Modify in this.selfInteraction[this.map]
    ) {
      this.props.unsetInteraction({
        uuid: this.selfInteraction[this.map][this.INTERACTIONS.Draw].uuid,
        widgetName: this.WIDGET_NAME,
        Type: this.INTERACTIONS.Draw,
      });
    }
  };

  onDrawEnd = () => {
    const draw = getInteraction(this.draw);
    if (draw) {
      draw.on("drawend", () => {
        const features = this.DrawSource.getFeatures();
        if (features.length > 0) {
          features[features.length - 1].setStyle(generateNewStyle());
        }
        this.setState({ drawn: true });
      });
    }
  };

  abortDrawing = () => {
    if (this.draw) {
      getInteraction(this.draw).abortDrawing();
    }
  };
  // LIFECYCLE
  componentDidUpdate() {
    document.addEventListener("keydown", this.escapeHandler);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escapeHandler);
    this.onReset();
  }
  onReset = () => {
    this.abortDrawing();
    this.removeAllInteractions();
  };

  removeAllInteractions = async () => {
    if (this.selfInteraction && this.map in this.selfInteraction) {
      const InteractionArray = [];
      Object.keys(this.selfInteraction[this.map]).map((InteractionName) => {
        const { uuid, Type } = this.selfInteraction[this.map][InteractionName];
        InteractionArray.push({ uuid, widgetName: this.WIDGET_NAME, Type });
      });
      if (InteractionArray.length > 0) {
        await this.props.unsetInteractions(InteractionArray);
      }
    }
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
            icon="grip-lines"
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
            disabled={!this.state.drawn}
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
            disabled={!this.state.drawn}
            icon={this.state.view ? "eye" : "eye-slash"}
            size="lg"
          />

          <IconButton
            className={`ui icon button pointer ${
              this.DrawSource && this.DrawSource.getFeatures().length > 0
                ? "positive"
                : "disabled"
            }`}
            onClick={() => this.onOpenEditSession()}
            disabled={!this.state.drawn}
            icon="edit"
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
  };
};

const mapDispatchToProps = {
  setInteraction,
  unsetInteraction,
  unsetInteractions,
  setOverlay,
  unsetOverlays,
  unsetOverlay,
  unsetUnfocused,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidgetLifeCycle(Draw));
