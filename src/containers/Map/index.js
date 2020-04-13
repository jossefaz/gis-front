import React from "react";
import { InitMap, addLayersSafely } from "./func";
import { connect } from "react-redux";
import config from "react-global-configuration";
import { logLevel, LogIt } from "../../utils/logs";
import { InitLayers, addLayers } from "../../redux/actions/layers";
import { InitRasters } from "../../redux/actions/raster";
import "./style.css";
class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
  }
  componentDidMount() {
    this.map = InitMap();
    LogIt(logLevel.INFO, "Map init");
    LogIt(logLevel.DEBUG, this.map);
    this.props.InitLayers(config.get("layers"));
    this.props.InitRasters();
  }

  addLayersSafely = (layers) => {
    const addedToMap = [];
    Object.keys(layers).map((lyrId) => {
      if (!layers[lyrId].addedToMap) {
        this.map.addLayer(layers[lyrId]);
        addedToMap.push(lyrId);
      }
    });
    if (addedToMap.length > 0) {
      this.props.addLayers(addedToMap);
    }
  };

  componentDidUpdate() {
    LogIt(logLevel.INFO, "Map Update");
    LogIt(logLevel.DEBUG, this.props.Layers);
    if (this.props.Rasters) {
      const { Catalog, Focused } = this.props.Rasters;
      this.map.getLayers().setAt(0, Catalog[Focused].layer);
    }
    this.addLayersSafely(this.props.Layers);
  }

  render() {
    const { target } = config.get("MapConfig");
    return <div id={target} className="map"></div>;
  }
}
const mapStateToProps = (state) => {
  return { Layers: state.mapLayers, Rasters: state.Rasters };
};

export default connect(mapStateToProps, { InitLayers, InitRasters, addLayers })(
  MapComponent
);
