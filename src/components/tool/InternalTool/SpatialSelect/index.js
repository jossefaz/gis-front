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
import { setSelectionForLayers } from "../../../../redux/actions/features";
import { selectSelectionLayers } from "../../../../redux/reducers";

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
    };
  }

  get registry() {
    return VectorLayerRegistry.getInstance();
  }

  componentDidMount() {
    this.registry.initVectorLayers([this.props.uuid]);
  }

  onOpenDrawSession = async (drawtype, freehand) => {
    await this.interactions.newDraw({
      type: drawtype,
      ...(freehand && { freehand: true }),
    });
    this.onDrawEnd();
  };

  onDrawEnd = async () => {
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
          ...this.props.spatialSelection,
          vector.get("__NessUUID__"),
        ];
        await this.props.setSelectionForLayers(newVectorLayers);
        await this.interactions.unDraw();
      });
    }
  };

  removeLayer = (uuid) => {
    this.registry.removeLayer(uuid);
    const newVectorLayers = this.props.spatialSelection.filter(
      (id) => id != uuid
    );
    this.props.setSelectionForLayers(newVectorLayers);
  };

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.spatialSelection, this.props.spatialSelection)) {
      const LayersToRemove = prevProps.spatialSelection.filter(
        (id) => !this.props.spatialSelection.includes(id)
      );
      const LayersToAdd = this.props.spatialSelection.filter(
        (id) => !prevProps.spatialSelection.includes(id)
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
        {/* <IconButton
          className={`ui icon button pointer ${
            this.state.drawtype == this.DRAW_TYPES.Line
              ? "secondary"
              : "primary"
          }`}
          onClick={() => this.onOpenDrawSession(this.DRAW_TYPES.Polygon, true)}
          icon="signature"
          size="lg"
        /> */}

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
