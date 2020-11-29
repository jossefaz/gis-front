import React, { Component } from "react";
import { InteractionUtil } from "../../../../utils/interactions";
import { connect } from "react-redux";
import { selectCurrentMapLayers } from "../../../../redux/reducers";
import VectorLayerRegistry from "../../../../utils/vectorlayers";
import IconButton from "../../../UI/Buttons/IconButton";
import { getEmptyVectorLayer } from "../../../../utils/interactions";
import styles from "../../../../nessMapping/mapStyle";
import { getFocusedMap } from "../../../../nessMapping/api";
import LayerList from "./LayerList";
import _ from "lodash";
class SpatialSelect extends Component {
  WIDGET_NAME = "SpatialSelect";
  DRAW_TYPES = {
    Polygon: "Polygon",
    Line: "LineString",
    Circle: "Circle",
    Text: "Text",
  };

  constructor() {
    super();
    this.interactions = new InteractionUtil(this.WIDGET_NAME);
    this.state = {
      drawtype: null,
      newVectorLayers: [],
    };
  }

  get registry() {
    return VectorLayerRegistry.getInstance();
  }

  componentDidMount() {
    this.registry.initVectorLayers([this.props.uuid]);
  }

  onOpenDrawSession = async (drawtype) => {
    await this.interactions.newDraw({ type: drawtype });
    this.onDrawEnd();
  };

  onDrawEnd = () => {
    if (this.interactions.currentDraw) {
      this.interactions.currentDraw.on("drawend", async (e) => {
        const features = this.registry
          .getVectorLayer(this.props.uuid)
          .getFeaturesByExtent(e.feature.getGeometry().getExtent());
        const { source, vector } = getEmptyVectorLayer(styles.EDIT);
        vector.setSource(source);
        this.registry.setNewVectorLayer(vector);
        features.map((f) => source.addFeature(f));
        const newVectorLayers = [
          ...this.state.newVectorLayers,
          vector.get("__NessUUID__"),
        ];
        this.setState({ newVectorLayers });
        this.interactions.unDraw();
      });
    }
  };

  removeLayer = (uuid) => {
    this.registry.removeLayer(uuid);
    const newVectorLayers = this.state.newVectorLayers.filter(
      (id) => id != uuid
    );
    this.setState({ newVectorLayers });
  };

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevState.newVectorLayers, this.state.newVectorLayers)) {
      const LayersToRemove = prevState.newVectorLayers.filter(
        (id) => !this.state.newVectorLayers.includes(id)
      );
      const LayersToAdd = this.state.newVectorLayers.filter(
        (id) => !prevState.newVectorLayers.includes(id)
      );
      LayersToRemove.map((id) => this.registry.removeLayer(id));
      LayersToAdd.map((id) => this.registry.getVectorLayer(id)._addToMap());
      console.log("map", getFocusedMap());
    }
    console.log("registry", this.registry);
  }

  render() {
    return (
      <React.Fragment>
        <IconButton
          className={`ui icon button pointer ${
            this.state.drawtype == this.DRAW_TYPES.Polygon
              ? "secondary"
              : "primary"
          }`}
          onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Polygon)}
          icon="draw-polygon"
          size="lg"
        />
        <IconButton
          className={`ui icon button pointer ${
            this.state.drawtype == this.DRAW_TYPES.Line
              ? "secondary"
              : "primary"
          }`}
          onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Line)}
          icon="grip-lines"
          size="lg"
        />

        <IconButton
          className={`ui icon button pointer ${
            this.state.drawtype == this.DRAW_TYPES.Circle
              ? "secondary"
              : "primary"
          }`}
          onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Circle)}
          icon="circle"
          size="lg"
        />

        <LayerList
          layersUUID={this.state.newVectorLayers}
          removeLayer={(uuid) => this.removeLayer(uuid)}
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Layers: selectCurrentMapLayers(state),
  };
};

export default connect(mapStateToProps)(SpatialSelect);
