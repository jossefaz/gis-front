import React from "react";
import { InitMap } from "./func";
import { connect } from "react-redux";
import config from "react-global-configuration";
import { logLevel, LogIt } from "../../utils/logs";
import { InitLayers } from "../../redux/actions/layers";
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

  componentDidUpdate() {
    LogIt(logLevel.INFO, "Map Update");
    Object.keys(this.props.mapLayers).map((lyrId) =>
      this.map.addLayer(this.props.mapLayers[lyrId])
    );
    if (this.props.Rasters) {
      const { Catalog, Focused } = this.props.Rasters;
      this.map.getLayers().setAt(0, Catalog[Focused]);
    }
  }

  render() {
    const { target } = config.get("MapConfig");
    return <div id={target} className="map"></div>;
  }
}
const mapStateToProps = (state) => {
  return { mapLayers: state.mapLayers, Rasters: state.Rasters };
};

export default connect(mapStateToProps, { InitLayers, InitRasters })(
  MapComponent
);
