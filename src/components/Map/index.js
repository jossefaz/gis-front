import React from "react";
import "./style.css";
import { getFocusedMap } from "../../nessMapping/api";

class MapComponent extends React.Component {
  componentDidMount() {
    if (getFocusedMap().getLayers().getArray().length == 0) {
      this.props.setRaster("osm");
    }
  }
  componentDidUpdate() {
    if (this.props.map) {
      this.map = getFocusedMap();
    }
    if (this.map.getLayers().getArray().length == 0) {
      this.props.setRaster("osm");
    }
  }
  render() {
    return <div id="map" className="map"></div>;
  }
}

export default MapComponent;
