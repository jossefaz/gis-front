import React from "react";
import { InitMap } from "./func";
import { connect } from "react-redux";
import config from "react-global-configuration";
import { logLevel, LogIt } from "../../../utils/logs";
import { InitLayers } from "../../../redux/actions/layers";
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
  }

  componentDidUpdate() {
    console.log("MAP UPDATE");
    Object.keys(this.props.mapLayers).map((lyrId) =>
      this.map.addLayer(this.props.mapLayers[lyrId])
    );
  }

  render() {
    const { target } = config.get("MapConfig");
    return <div id={target} className="map"></div>;
  }
}
const mapStateToProps = (state) => {
  return { mapLayers: state.mapLayers };
};

export default connect(mapStateToProps, { InitLayers })(MapComponent);
