import React from "react";
import "./style.css";
import PropTypes from "prop-types";
import { getFocusedMap, getFocusedMapProxy } from "../../nessMapping/api";
import VectorLayerRegistry from "../../utils/vectorlayers";

import _ from "lodash";
class MapComponent extends React.Component {
  state = {};

  defaultClickTool = async (e) => {
    const opennedTools = this.props.Tools[getFocusedMapProxy().uuid.value];
    console.log("CurrentInteractions", this.props.CurrentInteractions);
    if (
      opennedTools.order.length === 0 &&
      Object.keys(this.props.CurrentInteractions).length === 0
    ) {
      const features = this.vectorLayerRegistry.getFeaturesAtCoordinate(
        e.coordinate
      );
      if (features.length > 0) {
        await this.props.setSelectedFeatures(features);
        await this.props.toggleToolByName("Identify", true);
      }
    }
  };
  get vectorLayerRegistry() {
    return VectorLayerRegistry.getInstance();
  }

  componentDidMount() {
    if (getFocusedMap().getLayers().getArray().length == 0) {
      this.props.setRaster("osm");
    }
    getFocusedMap().on("pointerdown", this.defaultClickTool);
    if (getFocusedMapProxy().uuid.value in this.props.Layers) {
      this.setState({
        currentLayers: [],
      });
    }
  }
  componentDidUpdate() {
    if (getFocusedMap().getLayers().getArray().length == 0) {
      this.props.setRaster("osm");
    }
    const areEquals = _.isEqual(
      this.state.currentLayers,
      this.props.VisibleLayers
    );
    if (!areEquals) {
      this.vectorLayerRegistry.initVectorLayers(this.props.VisibleLayers);
      this.setState({
        currentLayers: this.props.VisibleLayers,
      });
    }
  }
  render() {
    return <div id="map" className="map"></div>;
  }
}

MapComponent.propTypes = {
  setRaster: PropTypes.func, // should be imported from redux action
};

export default MapComponent;
