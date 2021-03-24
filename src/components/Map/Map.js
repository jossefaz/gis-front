import React from "react";
import PropTypes from "prop-types";
import API from "../../core/api";
import VectorLayerRegistry from "../../core/proxymanagers/vectorlayer";
import _ from "lodash";

const { getFocusedMap, getFocusedMapUUID } = API.map;
class MapComponent extends React.Component {
  state = {};

  defaultClickTool = async (e) => {
    const opennedTools = this.props.Tools[getFocusedMapUUID()];
    if (
      opennedTools.dynamicTools.length === 0 &&
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
    if (getFocusedMapUUID() in this.props.Layers) {
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
