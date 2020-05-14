import React from "react";
import { connect } from "react-redux";
import "./style.css";
import { getFocusedMap } from '../../nessMapping/api'
import { setSelectedFeatures } from '../../redux/actions/features'
import { setRaster } from '../../redux/actions/raster'

class MapComponent extends React.Component {

  componentDidMount() {
    if (getFocusedMap().getLayers().getArray().length == 0) {
      this.props.setRaster("osm")
    }
  }

  componentDidUpdate() {
    if (this.props.map) {

      this.map = getFocusedMap()

    }

    if (this.map.getLayers().getArray().length == 0) {
      this.props.setRaster("osm")
    }




  }


  render() {
    return <div id="map" className="map"></div>;
  }
}
const mapStateToProps = (state) => {
  return {
    map: state.map
  };
};

export default connect(mapStateToProps, { setSelectedFeatures, setRaster })(MapComponent);
