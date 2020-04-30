import React from "react";
import { connect } from "react-redux";
import "./style.css";
import NessMapping from "../../nessMapping/mapping";

class MapComponent extends React.Component {

  componentDidUpdate() {
    if (this.props.map)
      this.map = NessMapping.getInstance().getMapProxy(this.props.map.focused)._olmap
    if (this.props.Rasters) {
      const { Catalog, Focused } = this.props.Rasters;
      this.map.getLayers().setAt(0, Catalog[Focused].layer);
    }
  }


  render() {
    return <div id="map" className="map"></div>;
  }
}
const mapStateToProps = (state) => {
  return {
    map: state.map,
    Rasters: state.Rasters,
  };
};

export default connect(mapStateToProps)(MapComponent);
