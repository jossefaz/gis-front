import React from "react";
import { connect } from "react-redux";
import { setSelectedFeatures } from "../../redux/actions/features";
import {
  selectVisibleLayers,
  selectCurrentInteractions,
} from "../../redux/reducers";
import { setRaster } from "../../redux/actions/raster";
import MapComp from "../../components/Map/Map";
import { toggleToolByName } from "../../redux/actions/tools";
class MapComponent extends React.Component {
  render() {
    return <MapComp {...this.props} />;
  }
}
const mapStateToProps = (state) => {
  return {
    map: state.map,
    Tools: state.Tools,
    VisibleLayers: selectVisibleLayers(state),
    Layers: state.Layers,
    CurrentInteractions: selectCurrentInteractions(state),
  };
};

export default connect(mapStateToProps, {
  setSelectedFeatures,
  setRaster,
  toggleToolByName,
})(MapComponent);
