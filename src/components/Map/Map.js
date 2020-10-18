import React from "react";
import "./style.css";
import PropTypes from "prop-types";

class MapComponent extends React.Component {
  componentDidMount() {
    if (this.props.getFocusedMap().getLayers().getArray().length == 0) {
      this.props.setRaster("osm");
    }
  }
  componentDidUpdate() {
    if (this.props.map) {
      this.map = this.props.getFocusedMap();
    }
    if (this.map.getLayers().getArray().length == 0) {
      this.props.setRaster("osm");
    }
  }
  render() {
    return <div id="map" className="map"></div>;
  }
}

MapComponent.propTypes = {
  getFocusedMap: PropTypes.func, // should be imported from NessMapping
  setRaster: PropTypes.func, // should be imported from redux action
};

export default MapComponent;
