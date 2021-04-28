import React from "react";
import { connect } from "react-redux";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle";
import API from "../../../../core/api";
import IconButton from "../../../UI/Buttons/IconButton";
import { generateNewStyle } from "../MeasureDistance/func";
import {
  createNewGeometry,
  updateGeometry,
} from "../../../../services/persistentGeometry/api";
import { escapeHandler } from "../../../../utils/eventHandlers";
import { GenerateUUID } from "../../../../utils/uuid";
import { InteractionUtil } from "../../../../utils/interactions";
import { OverlayUtil } from "../../../../utils/overlay";
import getOlFeatureFromJson from "../../../../utils/olFeatureFromGeoJson";
import TextForm from "./Texts/TextForm";
import Confirm from "../../../UI/Modal/Confirm";
import FeatureTable from "./FeatureTable";
import TextTable from "./Texts";
import ColorPicker from "../../../UI/ColorPicker/ColorPicker";
import { DragPan } from "ol/interaction";
import { Grid } from "semantic-ui-react";
import Point from "ol/geom/Point";
import axios from "axios";
import { InteractionSupportedTypes as TYPES } from "../../../../core/types/interaction";
import "./style.scss";
import { Button, ButtonGroup } from "react-bootstrap";

const { getFocusedMap } = API.map;
class Draw extends React.Component {
  WIDGET_NAME = "Draw";

  DRAW_TYPES = {
    Polygon: "Polygon",
    Line: "LineString",
    Circle: "Circle",
    Text: "Text",
  };
  state = {
    eraseDraw: {
      openAlert: false,
      content: "? האם ברצונך למחוק את כלל ציורים והטקסטים שביצעת",
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
    drawtype: null,
    sessionType: "Geometry",
    editText: {
      text: null,
      overlayID: null,
    },
  };

  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
    this.overlays = new OverlayUtil(this.WIDGET_NAME);
  }

  get selfOverlay() {
    return this.overlays.store;
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
    return this.interactions.getVectorLayer(TYPES.DRAW);
  }

  get DrawSource() {
    return this.interactions.getVectorSource(TYPES.DRAW);
  }

  toggleView = () => {
    if (this.DrawLayer) {
      this.DrawLayer.setVisible(!this.state.view);
      this.overlays.toggleAll();
    }
    this.setState({
      view: !this.state.view,
    });
  };

  addInteraction = (drawtype) => {
    this.interactions.newDraw({ type: drawtype });
  };

  onOpenDrawSession = (drawtype) => {
    this.addInteraction(drawtype);
    this.setState({ sessionType: "Geometry", drawtype });
    this.onDrawEnd();
  };

  onOpenEditSession = (featureID) => {
    const feature = this.interactions
      .getVectorSource(TYPES.DRAW)
      .getFeatureById(featureID);
    this.interactions.newSelect(feature, [
      this.interactions.getVectorLayer(TYPES.DRAW),
    ]);
    this.interactions.newModify(this.interactions.currentSelect.getFeatures());
    this.setState({ editSession: { status: true, current: featureID } });
    this.onModifyEnd();
  };

  autoClosingEditSession = (e) => {
    if (this.select) {
      const pointPosition = new Point(e.coordinate);
      let close = true;
      this.interactions.currentSelect
        .getFeatures()
        .getArray()
        .forEach((feature) => {
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

  onClearAll = () => {
    this.DrawSource.clear();
    this.setState({
      open: false,
      drawn: false,
      lastFeature: { ...this.state.lastFeature, [this.map]: null },
    });
    this.interactions.unDraw();
    this.overlays.unsetAll();
  };

  removeSelectAndEdit = () => {
    if (this.select && this.modify) {
      this.interactions.unSelect();
      this.interactions.unModify();
    }
  };

  retrieveExistingDrawing = async () => {
    const existing = await axios.get(
      "http://localhost:9090/persistentGeometry"
    );
    existing.data.forEach((polygon, index) => {
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

  removeOverlay = (uuid) => {
    if (uuid === this.state.editText.overlayID) {
      this.setState({
        editText: { ...this.state.editText, overlayID: null },
        sessionType: "",
      });
    }
    this.overlays.unset(uuid);
  };

  onDrawEnd = () => {
    if (this.interactions.currentDraw) {
      this.interactions.currentDraw.on("drawend", async (e) => {
        const newFeatureId =
          (await createNewGeometry(e.feature)) || GenerateUUID();
        e.feature.setId(newFeatureId);
        const { r, g, b, a } = this.state.defaultColor;
        e.feature.setStyle(generateNewStyle(`rgba(${r},${g},${b},${a})`));
        this.setState({
          drawn: true,
          lastFeature: { ...this.state.lastFeature, [this.map]: e.feature },
        });
      });
    }
  };

  onModifyEnd = () => {
    if (this.interactions.currentModify) {
      this.interactions.currentModify.on("modifyend", async (e) => {
        await updateGeometry(e.features.getArray()[0]);
      });
    }
  };

  abortDrawing = () => {
    if (this.interactions.currentDraw) {
      this.interactions.currentDraw.abortDrawing();
    }
  };
  // LIFECYCLE
  componentDidMount() {
    getFocusedMap().on("pointerdown", this.autoClosingEditSession);
    getFocusedMap().on("pointermove", (evt) => {
      this.overlays.dragOverlay(evt, () => this.dragPan.setActive(false));
    });
    getFocusedMap().on("pointerup", (evt) => {
      this.overlays.unDragOverlay(() => this.dragPan.setActive(false));
    });
    getFocusedMap()
      .getInteractions()
      .forEach((interaction) => {
        if (interaction instanceof DragPan) {
          this.dragPan = interaction;
        }
      });
    // this.retrieveExistingDrawing();
  }
  componentDidUpdate() {
    document.removeEventListener("keydown", (e) =>
      escapeHandler(e, this.interactions.unDraw)
    );
    document.addEventListener("keydown", (e) =>
      escapeHandler(e, this.interactions.unDraw)
    );
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", (e) =>
      escapeHandler(e, this.interactions.unDraw)
    );
    getFocusedMap().un("pointerdown", this.autoClosingEditSession);
    getFocusedMap().un("pointermove", this.overlays.dragOverlay);
    getFocusedMap().un("pointerup", this.overlays.unDragOverlay);
    this.onReset();
  }
  onReset = () => {
    this.abortDrawing();
    this.interactions.unsetAll();
  };

  createNewText = (text) => {
    const uuid = this.overlays.newText(text);
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

  createOrEditText = (text, textID) => {
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
      this.createNewText(text);
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

  onColorChange = (color) => this.setState({ defaultColor: color });

  onUnfocus = () => {
    this.onReset();
  };

  deleteLastFeature = (id) => {
    if (this.lastFeature && id === this.lastFeature.getId()) {
      this.setState({
        lastFeature: { ...this.state.lastFeature, [this.map]: null },
      });
    }
    this.setState({ ...this.state });
  };

  getDrawnFeatures = () => {
    return this.DrawSource ? this.DrawSource.getFeatures() : [];
  };

  handleTextChange = (text) => {
    this.setState({
      editText: { ...this.state.editText, text },
    });
  };

  render() {
    const features = this.getDrawnFeatures();
    const disable = features.length === 0;
    const overlays = this.selfOverlay;

    return (
      <div className="draw py-3">
        <p className="px-tool">יש לבחור כלי ולאחר מכן לבחור את מיקומו על המפה</p>

        <ButtonGroup className="btn-group-block">
          <Button variant="white" 
            onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Polygon)} 
            active={this.state.drawtype === this.DRAW_TYPES.Polygon}
          >
            <span>צורה</span>
            <i className="gis-icon gis-icon--graphic-pen-thin"></i>
          </Button>
          <Button variant="white" 
            onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Line)} 
            active={this.state.drawtype === this.DRAW_TYPES.Line}
          >
            <span>קו</span>
            <i className="gis-icon gis-icon--line"></i>
          </Button>
          <Button variant="white" 
            onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Circle)} 
            active={this.state.drawtype === this.DRAW_TYPES.Circle}
          >
            <span>עגול</span>
            <i className="gis-icon gis-icon--circle-dots"></i>
          </Button>
          <Button variant="white" 
            onClick={() => this.setState({
              sessionType: "Text",
              editText: {
                text: null,
                overlayID: null,
              },
              drawtype: this.DRAW_TYPES.Text,
            })}
            active={this.state.drawtype === this.DRAW_TYPES.Text}
          >
            <span>טקסט</span>
            <i className="gis-icon gis-icon--text-box"></i>
          </Button>
        </ButtonGroup>

        {!disable && (
          <React.Fragment>
            <div className="px-tool d-flex mt-5 mb-2">
              <strong className="flex-grow-1">רכיבים על גבי המפה</strong>
              <Button variant="white" onClick={() => this.setState({ open: true })} disabled={disable}>
                <i className="gis-icon gis-icon--trash"></i>
              </Button>
              <Button variant="white" onClick={() => this.toggleView()} disabled={disable}>
                <i className={'gis-icon gis-icon--' + (this.state.view ? "eye" : "eye-slash")}></i>
              </Button>
            </div>

            <FeatureTable
              features={features}
              source={this.DrawSource}
              defaultColor={this.state.defaultColor}
              deleteLastFeature={this.deleteLastFeature}
              onOpenEditSession={this.onOpenEditSession}
              editSession={this.state.editSession}
            />
          </React.Fragment>
        )}

        {overlays && (
          <TextTable
            overlays={this.selfOverlay}
            editText={this.editText}
            removeOverlay={this.removeOverlay}
          />
        )}
        
        {this.state.sessionType === "Text" && (
          <div className="draw-item">
            <TextForm
              cancelEdit={this.cancelEditText}
              onSubmit={this.createOrEditText}
              value={this.state.editText.text}
              setValue={this.handleTextChange}
              overlayID={this.state.editText.overlayID}
            />
          </div>
          )}

        <Confirm
          isOpen={this.state.open}
          confirmTxt={this.state.eraseDraw.content}
          cancelBtnTxt={this.state.eraseDraw.cancelBtn}
          confirmBtnTxt={this.state.eraseDraw.confirmBtn}
          onCancel={() =>
            this.setState({ ...this.state.eraseDraw, open: false })
          }
          onConfirm={this.onClearAll}
        />
      </div>
    );




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
              className={`ui icon button pointer ${this.state.drawtype === this.DRAW_TYPES.Polygon
                ? "secondary"
                : "primary"
                }`}
              onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Polygon)}
              icon="draw-polygon"
              size="lg"
            />
            <IconButton
              className={`ui icon button pointer ${this.state.drawtype === this.DRAW_TYPES.Line
                ? "secondary"
                : "primary"
                }`}
              onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Line)}
              icon="grip-lines"
              size="lg"
            />

            <IconButton
              className={`ui icon button pointer ${this.state.drawtype === this.DRAW_TYPES.Circle
                ? "secondary"
                : "primary"
                }`}
              onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Circle)}
              icon="circle"
              size="lg"
            />

            <IconButton
              className={`ui icon button pointer ${this.state.drawtype === this.DRAW_TYPES.Text
                ? "secondary"
                : "primary"
                }`}
              onClick={() =>
                this.setState({
                  sessionType: "Text",
                  editText: {
                    text: null,
                    overlayID: null,
                  },
                  drawtype: this.DRAW_TYPES.Text,
                })
              }
              icon="font"
              size="lg"
            />
          </Grid.Row>
          {this.state.sessionType === "Text" && (
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
          {this.state.sessionType === "Geometry" && (
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
                  className={`ui icon button pointer ${!disable ? "negative" : "disabled"
                    }`}
                  onClick={() => this.setState({ open: true })}
                  disabled={disable}
                  icon="trash-alt"
                  size="lg"
                />
                <IconButton
                  className={`ui icon button pointer ${!disable ? "positive" : "disabled"
                    }`}
                  onClick={() => this.toggleView()}
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
                  overlays={this.selfOverlay}
                  editText={this.editText}
                  removeOverlay={this.removeOverlay}
                />
              </Grid.Row>
            </React.Fragment>
          )}
        </Grid>
        <Confirm
          isOpen={this.state.open}
          confirmTxt={this.state.eraseDraw.content}
          cancelBtnTxt={this.state.eraseDraw.cancelBtn}
          confirmBtnTxt={this.state.eraseDraw.confirmBtn}
          onCancel={() =>
            this.setState({ ...this.state.eraseDraw, open: false })
          }
          onConfirm={this.onClearAll}
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

export default connect(mapStateToProps)(withWidgetLifeCycle(Draw));
