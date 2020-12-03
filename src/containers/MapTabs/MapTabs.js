import React from "react";
import { connect } from "react-redux";
import { InitMap, setMapFocus } from "../../redux/actions/map";
import { InitLayers } from "../../redux/actions/layers";
import { resetTools, toolsReseted } from "../../redux/actions/tools";
import MapTabs from "../../components/MapTabs/MapTabs";

class MapTabsContainer extends React.Component {
  render() {
    return <MapTabs {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  maps: state.map,
});

export default connect(mapStateToProps, {
  InitMap,
  InitLayers,
  setMapFocus,
  resetTools,
  toolsReseted,
})(MapTabsContainer);
