import React from "react";
import { connect } from "react-redux";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
<<<<<<< HEAD
import {
  getInteraction,
  getInteractionGraphicLayer,
  getInteractionVectorSource,
  getFocusedMap,
  getOverlay,
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
  setOverlayProperty,
} from "../../../../redux/actions/overlay";
import IconButton from "../../../UI/Buttons/IconButton";
import { unsetUnfocused } from "../../../../redux/actions/tools";
import { generateNewStyle } from "../MeasureDistance/func";
import generateID from "../../../../utils/uuid";
import { escapeHandler } from "../../../../utils/eventHandlers";
import TextForm from "./Texts/TextForm";
import { Confirm, Label } from "semantic-ui-react";
import FeatureTable from "./FeatureTable";
import TextTable from "./Texts";
import ColorPicker from "./ColorPicker";
import { DragPan } from "ol/interaction";
import { Grid } from "semantic-ui-react";
import Collection from "ol/Collection";
import Point from "ol/geom/Point";
import "./style.css";
class Draw extends React.Component {
  WIDGET_NAME = "Draw";
  INTERACTIONS = {
    Draw: "Draw",
    Select: "Select",
    Modify: "Modify",
  };
  CLASSNAMES = {
    TEXT: "ol-tooltip ol-tooltip-measure",
    HIDDEN: "hidden",
    FINISH: "ol-tooltip ol-tooltip-static",
=======
import { getFocusedMap, getOverlay } from "../../../../nessMapping/api";
import IconButton from "../../../UI/Buttons/IconButton";
import { generateNewStyle } from "../MeasureDistance/func";
import {
  createNewGeometry,
  updateGeometry,
} from "../../../../services/persistentGeometry/api";
import { escapeHandler } from "../../../../utils/eventHandlers";
import generateID from "../../../../utils/uuid";
import { InteractionUtil } from "../../../../utils/interactions";
import { OverlayUtil } from "../../../../utils/overlay";
import getOlFeatureFromJson from "../../../../utils/olFeatureFromGeoJson";
import TextForm from "./Texts/TextForm";
import { Confirm } from "semantic-ui-react";
import FeatureTable from "./FeatureTable";
import TextTable from "./Texts";
import ColorPicker from "./ColorPicker/ColorPicker";
import { DragPan } from "ol/interaction";
import { Grid } from "semantic-ui-react";
import Point from "ol/geom/Point";
import axios from "axios";
import "./style.css";
class Draw extends React.Component {
  WIDGET_NAME = "Draw";

  DRAW_TYPES = {
    Polygon: "Polygon",
    Line: "LineString",
    Circle: "Circle",
    Text: "Text",
>>>>>>> upstream/master
  };
  state = {
    eraseDraw: {
      openAlert: false,
<<<<<<< HEAD
      content: "? האם ברצונך למחוק את כלל המדידות שביצת",
=======
      content: "? האם ברצונך למחוק את כלל ציורים והטקסטים שביצעת",
>>>>>>> upstream/master
      confirmBtn: "כן",
      cancelBtn: "לא",
    },
    editSession: false,
    view: true,
    drawn: false,
    lastFeature: {},
    drawCount: 0,
    defaultColor: {
      r: "241",
      g: "112",
      b: "19",
      a: "1",
    },
<<<<<<< HEAD
=======
    drawtype: null,
>>>>>>> upstream/master
    sessionType: "Geometry",
    editText: {
      text: null,
      overlayID: null,
    },
  };

<<<<<<< HEAD
  get selfOverlay() {
    if (
      this.WIDGET_NAME in this.props.Overlays &&
      this.map in this.props.Overlays[this.WIDGET_NAME]
    ) {
      return this.props.Overlays[this.WIDGET_NAME][this.map];
    }
    return false;
=======
  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
    this.overlays = new OverlayUtil(this.WIDGET_NAME);
  }

  get selfOverlay() {
    return this.overlays.store;
>>>>>>> upstream/master
  }

  get map() {
    return this.props.maps.focused;
  }

  get lastFeature() {
    return this.map in this.state.lastFeature
      ? this.state.lastFeature[this.map]
      : false;
  }

  get selfInteraction() {
<<<<<<< HEAD
    if (
      this.WIDGET_NAME in this.props.Interactions &&
      this.map in this.props.Interactions[this.WIDGET_NAME]
    ) {
      return this.props.Interactions[this.WIDGET_NAME][this.map];
    }
    return false;
  }

  get draw() {
    return this.getSelfInteraction(this.INTERACTIONS.Draw);
  }

  get select() {
    return this.getSelfInteraction(this.INTERACTIONS.Select);
  }

  get modify() {
    return this.getSelfInteraction(this.INTERACTIONS.Modify);
  }
  getSelfInteraction = (interaction) => {
    if (this.selfInteraction && interaction in this.selfInteraction) {
      return this.selfInteraction[interaction].uuid;
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
=======
    return this.interactions.store;
  }

  get draw() {
    return this.interactions.currentDrawUUID;
  }

  get select() {
    return this.interactions.currentSelectUUID;
  }

  get modify() {
    return this.interactions.currentModifyUUID;
  }
  get DrawLayer() {
    return this.interactions.getVectorLayer(this.interactions.TYPES.DRAW);
  }

  get DrawSource() {
    return this.interactions.getVectorSource(this.interactions.TYPES.DRAW);
  }

  toggleView = () => {
    if (this.DrawLayer) {
      this.DrawLayer.setVisible(!this.state.view);
      this.overlays.toggleAll();
>>>>>>> upstream/master
    }
    this.setState({
      view: !this.state.view,
    });
  };

  addInteraction = async (drawtype) => {
<<<<<<< HEAD
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
=======
    this.interactions.unDraw();
    await this.interactions.newDraw({ type: drawtype });
>>>>>>> upstream/master
  };

  onOpenDrawSession = async (drawtype) => {
    await this.addInteraction(drawtype);
<<<<<<< HEAD
    this.setState({ sessionType: "Geometry" });
=======
    this.setState({ sessionType: "Geometry", drawtype });
>>>>>>> upstream/master
    this.onDrawEnd();
  };

  onOpenEditSession = async (featureID) => {
    this.removeSelectAndEdit();
<<<<<<< HEAD
    this.removeDrawObject();
    const feature = featureID
      ? this.DrawSource.getFeatureById(featureID)
      : null;
    await this.props.setInteraction({
      Type: this.INTERACTIONS.Select,
      interactionConfig: {
        wrapX: false,
        layers: [this.DrawLayer],
        ...(feature && { features: new Collection([feature]) }),
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
    this.setState({ editSession: { status: true, current: feature.getId() } });
=======
    this.interactions.unDraw();
    await this.interactions.newSelect(featureID, [
      this.interactions.getVectorLayer(this.interactions.TYPES.DRAW),
    ]);
    await this.interactions.newModify();
    this.setState({ editSession: { status: true, current: featureID } });
    this.onModifyEnd();
>>>>>>> upstream/master
  };

  autoClosingEditSession = (e) => {
    if (this.select) {
      const pointPosition = new Point(e.coordinate);
      let close = true;
<<<<<<< HEAD
      getInteraction(this.select)
=======
      this.interactions.currentSelect
>>>>>>> upstream/master
        .getFeatures()
        .getArray()
        .map((feature) => {
          if (
            pointPosition.intersectsExtent(feature.getGeometry().getExtent())
          ) {
            close = false;
          }
        });
      if (close) {
        this.setState({ editSession: { status: false, current: null } });
        this.removeSelectAndEdit();
      }
    }
  };

<<<<<<< HEAD
  onClearDrawing = () => {
=======
  onClearAll = () => {
>>>>>>> upstream/master
    this.DrawSource.clear();
    this.setState({
      open: false,
      drawn: false,
      lastFeature: { ...this.state.lastFeature, [this.map]: null },
    });
<<<<<<< HEAD
    this.removeDrawObject();
  };
  removeDrawObject = () => {
    if (this.draw) {
      this.props.unsetInteraction({
        uuid: this.selfInteraction[this.INTERACTIONS.Draw].uuid,
        widgetName: this.WIDGET_NAME,
        Type: this.INTERACTIONS.Draw,
      });
    }
=======
    this.interactions.unDraw();
    this.overlays.unsetAll();
>>>>>>> upstream/master
  };

  removeSelectAndEdit = async () => {
    if (this.select && this.modify) {
<<<<<<< HEAD
      const { Select, Modify } = this.INTERACTIONS;
      await this.props.unsetInteractions([
        {
          uuid: this.select,
          widgetName: this.WIDGET_NAME,
          Type: Select,
        },
        {
          uuid: this.modify,
          widgetName: this.WIDGET_NAME,
          Type: Modify,
        },
      ]);
    }
  };

=======
      await this.interactions.unSelect();
      await this.interactions.unModify();
    }
  };

  retrieveExistingDrawing = async () => {
    const existing = await axios.get(
      "http://localhost:9090/persistentGeometry"
    );
    existing.data.map((polygon, index) => {
      const feature = getOlFeatureFromJson(polygon["geometry"]);
      feature.setId(polygon["id"]);
      this.DrawSource.addFeature(feature);
      if (index === existing.data.length - 1) {
        this.setState({
          lastFeature: { ...this.state.lastFeature, [this.map]: feature },
        });
      }
    });
  };

>>>>>>> upstream/master
  removeOverlay = (uuid) => {
    if (uuid == this.state.editText.overlayID) {
      this.setState({
        editText: { ...this.state.editText, overlayID: null },
        sessionType: "",
      });
    }
<<<<<<< HEAD
    this.props.unsetOverlay({ uuid, widgetName: this.WIDGET_NAME });
  };

  onDrawEnd = () => {
    const draw = getInteraction(this.draw);
    if (draw) {
      draw.on("drawend", (e) => {
        const { r, g, b, a } = this.state.defaultColor;
        e.feature.setStyle(generateNewStyle(`rgba(${r},${g},${b},${a})`));
        e.feature.setId(generateID());
=======
    this.overlays.unset(uuid);
  };

  onDrawEnd = () => {
    const draw = this.interactions.currentDraw;
    if (draw) {
      draw.on("drawend", async (e) => {
        const newFeatureId =
          (await createNewGeometry(e.feature)) || generateID();
        e.feature.setId(newFeatureId);
        const { r, g, b, a } = this.state.defaultColor;
        e.feature.setStyle(generateNewStyle(`rgba(${r},${g},${b},${a})`));
>>>>>>> upstream/master
        this.setState({
          drawn: true,
          lastFeature: { ...this.state.lastFeature, [this.map]: e.feature },
        });
      });
    }
  };

<<<<<<< HEAD
  abortDrawing = () => {
    if (this.draw) {
      getInteraction(this.draw).abortDrawing();
=======
  onModifyEnd = () => {
    const modify = this.interactions.currentModify;
    if (modify) {
      modify.on("modifyend", async (e) => {
        await updateGeometry(e.features.getArray()[0]);
      });
    }
  };

  abortDrawing = () => {
    if (this.interactions.currentDraw) {
      this.interactions.currentDraw.abortDrawing();
>>>>>>> upstream/master
    }
  };
  // LIFECYCLE
  componentDidMount() {
    getFocusedMap().on("pointerdown", this.autoClosingEditSession);
<<<<<<< HEAD
    getFocusedMap().on("pointermove", this.dragOverlay);
    getFocusedMap().on("pointerup", this.unDragOverlay);
=======
    getFocusedMap().on("pointermove", (evt) => {
      this.overlays.dragOverlay(evt, () => this.dragPan.setActive(false));
    });
    getFocusedMap().on("pointerup", (evt) => {
      this.overlays.unDragOverlay(() => this.dragPan.setActive(false));
    });
>>>>>>> upstream/master
    getFocusedMap()
      .getInteractions()
      .forEach((interaction) => {
        if (interaction instanceof DragPan) {
          this.dragPan = interaction;
<<<<<<< HEAD
        }
      });
  }
  componentDidUpdate() {
    document.addEventListener("keydown", (e) =>
      escapeHandler(e, this.abortDrawing)
    );
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", (e) =>
      escapeHandler(e, this.abortDrawing)
    );
    getFocusedMap().un("pointerdown", this.autoClosingEditSession);
    getFocusedMap().un("pointermove", this.dragOverlay);
    getFocusedMap().un("pointerup", this.unDragOverlay);
    this.onReset();
  }
  onReset = () => {
    this.abortDrawing();
    this.removeAllInteractions();
  };

  removeAllInteractions = async () => {
    if (this.selfInteraction) {
      const InteractionArray = [];
      Object.keys(this.selfInteraction).map((InteractionName) => {
        const { uuid, Type } = this.selfInteraction[InteractionName];
        InteractionArray.push({ uuid, widgetName: this.WIDGET_NAME, Type });
      });
      if (InteractionArray.length > 0) {
        await this.props.unsetInteractions(InteractionArray);
      }
    }
  };

  createNewText = async (text) => {
    const selector = `${this.WIDGET_NAME}${this.map}`;
    await this.props.setOverlay({
      overlay: {
        element: this.generateOverlayDiv(selector, text),
        offset: [0, -15],
        positioning: "bottom-center",
        stopEvent: false,
        dragging: false,
      },
      widgetName: this.WIDGET_NAME,
      content: text,
      selector,
    });
    if (this.selfOverlay) {
      const currentOverlays = Object.keys(this.selfOverlay.overlays);
      const lastID = currentOverlays[currentOverlays.length - 1];
      const overlay = getOverlay(lastID);
      overlay.setPosition(getFocusedMap().getView().getCenter());
      this.addDraggableToOverlay(lastID);
    }
    this.setState({
      sessionType: "",
      editText: {
        text: "",
        overlayID: null,
      },
    });
  };

  createOrEditText = async (text, textID) => {
    if (textID) {
      const overlay = this.selfOverlay.overlays[textID];
      const overlayDiv = document.querySelector(`#${overlay.selector}`);
      this.props.setOverlayProperty({
        widgetName: this.WIDGET_NAME,
        uuid: textID,
        property: "content",
        value: text,
      });
      overlayDiv.innerHTML = text;
      this.setState({
        sessionType: "",
        editText: {
          text: "",
          overlayID: null,
        },
      });
    } else {
      await this.createNewText(text);
    }
  };

  generateOverlayDiv(selector, innerHtml) {
    const overlayDiv = document.createElement("div");
    overlayDiv.setAttribute("id", selector);
    overlayDiv.setAttribute("class", this.CLASSNAMES.TEXT);
    overlayDiv.innerHTML = innerHtml;
    return overlayDiv;
  }

  dragOverlay = (evt) => {
    if (this.selfOverlay) {
      Object.keys(this.selfOverlay.overlays).map((ol) => {
        const overlay = getOverlay(ol);
        if (overlay.get("dragging")) {
          this.dragPan.setActive(false);
          overlay.setPosition(evt.coordinate);
        }
      });
    }
  };

  unDragOverlay = (evt) => {
    if (this.selfOverlay) {
      Object.keys(this.selfOverlay.overlays).map((ol) => {
        if (getOverlay(ol).get("dragging")) {
          this.dragPan.setActive(true);
          getOverlay(ol).set("dragging", false);
        }
      });
=======
        }
      });
    this.retrieveExistingDrawing();
  }
  componentDidUpdate() {
    document.addEventListener("keydown", (e) =>
      escapeHandler(e, this.abortDrawing)
    );
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", (e) =>
      escapeHandler(e, this.abortDrawing)
    );
    getFocusedMap().un("pointerdown", this.autoClosingEditSession);
    getFocusedMap().un("pointermove", this.dragOverlay);
    getFocusedMap().un("pointerup", this.unDragOverlay);
    this.onReset();
  }
  onReset = async () => {
    this.abortDrawing();
    await this.interactions.unsetAll();
  };

  createNewText = async (text) => {
    const uuid = await this.overlays.newText(text);
    this.overlays.addToMap(uuid);
    this.overlays.addDraggable(uuid);
    this.setState({
      sessionType: "",
      editText: {
        text: "",
        overlayID: null,
      },
    });
  };

  createOrEditText = async (text, textID) => {
    if (textID) {
      this.overlays.edit(textID, text);
      this.setState({
        sessionType: "",
        editText: {
          text: "",
          overlayID: null,
        },
      });
    } else {
      await this.createNewText(text);
>>>>>>> upstream/master
    }
  };

  editText = (text, overlayID) => {
    this.setState({
      sessionType: "Text",
      editText: {
        text,
        overlayID,
      },
    });
  };

  cancelEditText = () => {
    this.setState({
      sessionType: "",
      editText: {
        text: "",
        overlayID: null,
      },
    });
  };

<<<<<<< HEAD
  addDraggableToOverlay = (id) => {
    const overlay = this.selfOverlay.overlays[id];
    const overlayDiv = document.getElementById(overlay.selector);
    const widgetName = this.WIDGET_NAME;
    overlayDiv.setAttribute("uuid", id);
    overlayDiv.setAttribute("dragging", false);
    overlayDiv.addEventListener("mousedown", function (evt) {
      getOverlay(this.id.split(widgetName)[1]).set("dragging", true);
      console.info("start dragging");
    });
  };

=======
>>>>>>> upstream/master
  onColorChange = (color) => this.setState({ defaultColor: color });

  onUnfocus = () => {
    this.onReset();
  };

  deleteLastFeature = (id) => {
    if (this.lastFeature && id == this.lastFeature.getId()) {
      this.setState({
        lastFeature: { ...this.state.lastFeature, [this.map]: null },
      });
    }
  };

  getDrawnFeatures = () => {
    if (this.lastFeature) {
      const lastFeatureId = this.lastFeature.getId();
      const filteredFeatures = this.DrawSource.getFeatures().filter(
        (f) => f.getId() !== lastFeatureId
      );
      return [...filteredFeatures, this.lastFeature];
    }
    return this.DrawSource ? this.DrawSource.getFeatures() : [];
  };

  handleTextChange = (text) => {
    this.setState({
      editText: { ...this.state.editText, text },
    });
  };

  render() {
    const features = this.getDrawnFeatures();
    const disable = features.length == 0;
    const overlays = this.selfOverlay;
    return (
      <React.Fragment>
        <Grid
          columns="equal"
          stackable
          divided="vertically"
          className="widhtEm"
        >
          <Grid.Row>
            <label className="labels">בחר צורה : </label>

            <IconButton
<<<<<<< HEAD
              className="ui icon button primary pointer"
              onClick={() => this.onOpenDrawSession("Polygon")}
=======
              className={`ui icon button pointer ${
                this.state.drawtype == this.DRAW_TYPES.Polygon
                  ? "secondary"
                  : "primary"
              }`}
              onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Polygon)}
>>>>>>> upstream/master
              icon="draw-polygon"
              size="lg"
            />
            <IconButton
<<<<<<< HEAD
              className="ui icon button primary pointer"
              onClick={() => this.onOpenDrawSession("LineString")}
=======
              className={`ui icon button pointer ${
                this.state.drawtype == this.DRAW_TYPES.Line
                  ? "secondary"
                  : "primary"
              }`}
              onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Line)}
>>>>>>> upstream/master
              icon="grip-lines"
              size="lg"
            />

            <IconButton
<<<<<<< HEAD
              className="ui icon button primary pointer"
              onClick={() => this.onOpenDrawSession("Circle")}
=======
              className={`ui icon button pointer ${
                this.state.drawtype == this.DRAW_TYPES.Circle
                  ? "secondary"
                  : "primary"
              }`}
              onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Circle)}
>>>>>>> upstream/master
              icon="circle"
              size="lg"
            />

            <IconButton
<<<<<<< HEAD
              className="ui icon button primary pointer"
=======
              className={`ui icon button pointer ${
                this.state.drawtype == this.DRAW_TYPES.Text
                  ? "secondary"
                  : "primary"
              }`}
>>>>>>> upstream/master
              onClick={() =>
                this.setState({
                  sessionType: "Text",
                  editText: {
                    text: null,
                    overlayID: null,
                  },
<<<<<<< HEAD
=======
                  drawtype: this.DRAW_TYPES.Text,
>>>>>>> upstream/master
                })
              }
              icon="font"
              size="lg"
            />
          </Grid.Row>
          {this.state.sessionType == "Text" && (
            <Grid.Row>
              <TextForm
                cancelEdit={this.cancelEditText}
                onSubmit={this.createOrEditText}
                value={this.state.editText.text}
                setValue={this.handleTextChange}
                overlayID={this.state.editText.overlayID}
              />
            </Grid.Row>
          )}
          {this.state.sessionType == "Geometry" && (
            <Grid.Row>
              <label className="labels">בחר צבע : </label>
              <ColorPicker
                onColorChange={this.onColorChange}
                defaultColor={this.state.defaultColor}
              />
            </Grid.Row>
          )}

          {!disable && (
            <React.Fragment>
              <Grid.Row>
                <label className="labels">שליטה כללית : </label>
                <IconButton
                  className={`ui icon button pointer ${
                    !disable ? "negative" : "disabled"
                  }`}
                  onClick={() => this.setState({ open: true })}
                  disabled={disable}
                  icon="trash-alt"
                  size="lg"
                />
                <IconButton
                  className={`ui icon button pointer ${
                    !disable ? "positive" : "disabled"
                  }`}
<<<<<<< HEAD
                  onClick={() => this.toogleView()}
=======
                  onClick={() => this.toggleView()}
>>>>>>> upstream/master
                  disabled={disable}
                  icon={this.state.view ? "eye" : "eye-slash"}
                  size="lg"
                />
              </Grid.Row>
              <Grid.Row>
                <FeatureTable
                  features={features}
                  source={this.DrawSource}
                  defaultColor={this.state.defaultColor}
                  deleteLastFeature={this.deleteLastFeature}
                  onOpenEditSession={this.onOpenEditSession}
                  editSession={this.state.editSession}
                />
              </Grid.Row>
            </React.Fragment>
          )}
          {overlays && (
            <React.Fragment>
              <Grid.Row>
                <TextTable
<<<<<<< HEAD
                  overlays={this.selfOverlay.overlays}
=======
                  overlays={this.selfOverlay}
>>>>>>> upstream/master
                  editText={this.editText}
                  removeOverlay={this.removeOverlay}
                />
              </Grid.Row>
            </React.Fragment>
          )}
        </Grid>
        <Confirm
          open={this.state.open}
          size="mini"
          content={this.state.eraseDraw.content}
          cancelButton={this.state.eraseDraw.cancelBtn}
          confirmButton={this.state.eraseDraw.confirmBtn}
          onCancel={() =>
            this.setState({ ...this.state.eraseDraw, open: false })
          }
<<<<<<< HEAD
          onConfirm={this.onClearDrawing}
=======
          onConfirm={this.onClearAll}
>>>>>>> upstream/master
        />
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

<<<<<<< HEAD
const mapDispatchToProps = {
  setInteraction,
  unsetInteraction,
  unsetInteractions,
  setOverlay,
  unsetOverlays,
  unsetOverlay,
  unsetUnfocused,
  setOverlayProperty,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidgetLifeCycle(Draw));
=======
export default connect(mapStateToProps)(withWidgetLifeCycle(Draw));
>>>>>>> upstream/master
