import React from "react";
import { InitMap, Identify, addLayersSafely } from "./func";
import { connect } from "react-redux";
import config from "react-global-configuration";
import { logLevel, LogIt } from "../../utils/logs";
import { addLayers } from "../../redux/actions/layers";
import { setSelectedFeatures } from "../../redux/actions/features";
import "./style.css";

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
  }
  componentDidMount() {
    this.map = InitMap();
    this.map.on("click", (evt) => {
      const { tools, order: focusedTool } = this.props.Tools;
      if (focusedTool.length > 0) {
        LogIt(
          logLevel.DEBUG,
          `This click will go the the tool : ${tools[focusedTool[0]].ToolName}`
        );
        switch (tools[focusedTool[0]].ToolName) {
          case "Identify":
            Identify(evt, this.map, this.props.setSelectedFeatures);
            break;

          default:
            break;
        }
      } else {
        LogIt(
          logLevel.DEBUG,
          "No tool focused yet ! This click won't be dispatched"
        );
      }
    });
  }
  componentDidUpdate() {
    LogIt(logLevel.INFO, "Map Update");

    if (this.props.Rasters) {
      const { Catalog, Focused } = this.props.Rasters;
      this.map.getLayers().setAt(0, Catalog[Focused].layer);
    }
    addLayersSafely(this.props.Layers, this.map, this.props.addLayers);
    if (
      !this.props.Features.Draw.Session &&
      this.props.Features.Draw.DrawObject
    ) {
      this.map.removeInteraction(this.props.Features.Draw.DrawObject);
    } else if (this.props.Features.Draw.Session) {
      this.map.addInteraction(this.props.Features.Draw.DrawObject);
    }
  }

  render() {
    const { target } = config.get("MapConfig");
    return <div id={target} className="map"></div>;
  }
}
const mapStateToProps = (state) => {
  return {
    Layers: state.mapLayers,
    Rasters: state.Rasters,
    Tools: state.Tools,
    Features: state.Features,
  };
};

export default connect(mapStateToProps, {
  addLayers,
  setSelectedFeatures,
})(MapComponent);
