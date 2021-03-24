import React, { Component } from "react";
import { InteractionUtil } from "../../../../utils/interactions";
import { connect } from "react-redux";
import {
  selectCurrentMapLayers,
  selectSelectionLayers,
} from "../../../../state/reducers";
import VectorLayerRegistry from "../../../../core/proxymanagers/vectorlayer";
import IconButton from "../../../UI/Buttons/IconButton";
import styles from "../../../../core/mapStyle";
import API from "../../../../core/api";
import LayerList from "./LayerList";
import { setSelectionForLayers } from "../../../../state/actions";
import { escapeHandler } from "../../../../utils/eventHandlers";
import { getBufferedFeature } from "../../../../utils/jsts";

import _ from "lodash";
const { getEmptyVectorLayer } = API.interactions;
class SpatialSelect extends Component {
  WIDGET_NAME = "SpatialSelect";
  DRAW_TYPES = {
    Polygon: "Polygon",
    Line: "LineString",
    Point: "Point",
    Circle: "Circle",
    Text: "Text",
  };

  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
    this.state = {
      drawtype: null,
      buffer: 0,
    };
  }

  get registry() {
    return VectorLayerRegistry.getInstance();
  }

  componentDidMount() {
    this.registry.initVectorLayers([this.props.uuid]);
  }

  onOpenDrawSession = async (drawtype, freehand) => {
    const { buffer } = this.state;
    const { Point, Line, Polygon, Circle } = this.DRAW_TYPES;
    if (
      ((drawtype == Point || drawtype == Line) && Boolean(buffer)) ||
      drawtype == Polygon ||
      drawtype == Circle
    ) {
      await this.interactions.newDraw({
        type: drawtype,
        ...(freehand && { freehand: true }),
      });
      this.onDrawEnd();
    }
    this.setState({ drawtype });
  };

  onDrawEnd = async () => {
    if (this.interactions.currentDraw) {
      this.interactions.currentDraw.on("drawend", async (e) => {
        let featureSelectore = e.feature;
        if (this.state.buffer) {
          featureSelectore = getBufferedFeature(
            featureSelectore,
            this.state.buffer
          );
        }
        const features = this.registry
          .getVectorLayer(this.props.uuid)
          .getFeaturesByExtent(featureSelectore.getGeometry().getExtent());
        if (features.length > 0) {
          const { source, vector } = getEmptyVectorLayer(styles.DRAW_END);
          vector.setSource(source);
          this.registry.setNewVectorLayer(vector);
          features.map((f) => {
            f.setStyle(styles.DRAW_END);
            source.addFeature(f);
          });
          const newVectorLayers = [
            ...this.props.spatialSelection,
            vector.get("__NessUUID__"),
          ];
          await this.props.setSelectionForLayers(newVectorLayers);
        }

        await this.interactions.unDraw(true);
      });
    }
  };

  handleBufferChange = (e, v) => {
    this.setState({ buffer: e.target.value, drawtype: null });
  };

  removeLayer = (uuid) => {
    this.registry.removeLayer(uuid);
    const newVectorLayers = this.props.spatialSelection.filter(
      (id) => id != uuid
    );
    this.props.setSelectionForLayers(newVectorLayers);
  };
  abortDrawing = () => {
    if (this.interactions.currentDraw) {
      this.interactions.currentDraw.abortDrawing();
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.uuid != this.props.uuid) {
      this.registry.initVectorLayers([this.props.uuid]);
    }
    if (!_.isEqual(prevProps.spatialSelection, this.props.spatialSelection)) {
      const LayersToRemove = prevProps.spatialSelection.filter(
        (id) => !this.props.spatialSelection.includes(id)
      );
      const LayersToAdd = this.props.spatialSelection.filter(
        (id) => !prevProps.spatialSelection.includes(id)
      );
      LayersToRemove.map((id) => this.registry.removeLayer(id));
      LayersToAdd.map((id) => this.registry.getVectorLayer(id)._addToMap());
    }

    document.addEventListener("keydown", (e) =>
      escapeHandler(e, this.abortDrawing)
    );
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", (e) =>
      escapeHandler(e, this.abortDrawing)
    );
    this.interactions.unDraw();
  }
  render() {
    const { drawtype, buffer } = this.state;
    const { Point, Line, Polygon, Circle } = this.DRAW_TYPES;
    return (
      <React.Fragment>
        <div className="ui input" style={{ display: "block" }}>
          <input
            type="number"
            placeholder="buffer"
            onChange={this.handleBufferChange}
          />
          {(drawtype == Point || drawtype == Line) && !Boolean(buffer) && (
            <div style={{ color: "red" }}>
              לבחירה קווית או נקודתי חייבים להכניס ערך חיץ
            </div>
          )}
        </div>

        <IconButton
          className={`ui icon button pointer ${
            drawtype == Polygon ? "secondary" : "primary"
          }`}
          onClick={() => this.onOpenDrawSession(Polygon)}
          icon="draw-polygon"
          size="lg"
        />

        <IconButton
          className={`ui icon button pointer ${
            drawtype == Circle ? "secondary" : "primary"
          }`}
          onClick={() => this.onOpenDrawSession(Circle)}
          icon="circle"
          size="lg"
        />
        <IconButton
          className={`ui icon button pointer ${
            drawtype == Line && Boolean(buffer) ? "secondary" : "primary"
          }`}
          onClick={() => this.onOpenDrawSession(Line)}
          icon="grip-lines"
          size="lg"
        />
        <IconButton
          className={`ui icon button pointer ${
            drawtype == Point && Boolean(buffer) ? "secondary" : "primary"
          }`}
          onClick={() => this.onOpenDrawSession(Point)}
          icon="map-marker-alt"
          size="lg"
        />

        <LayerList
          layersUUID={this.props.spatialSelection}
          removeLayer={(uuid) => this.removeLayer(uuid)}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Layers: selectCurrentMapLayers(state),
    spatialSelection: selectSelectionLayers(state),
  };
};

export default connect(mapStateToProps, { setSelectionForLayers })(
  SpatialSelect
);
