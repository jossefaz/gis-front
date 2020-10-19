import React from "react";
import { connect } from "react-redux";
import { setSelectedFeatures } from "../../redux/actions/features";
import { setRaster } from "../../redux/actions/raster";
import MapComp from "../../components/Map/Map";
import { getFocusedMap } from "../../nessMapping/api";
class MapComponent extends React.Component {
  render() {
    return <MapComp getFocusedMap={getFocusedMap} {...this.props} />;
  }
}
const mapStateToProps = (state) => {
  return {
    map: state.map,
  };
};

export default connect(mapStateToProps, { setSelectedFeatures, setRaster })(
  MapComponent
);
