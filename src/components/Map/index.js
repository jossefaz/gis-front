import React from "react";
import { connect } from "react-redux";
import "./style.css";
import NessMapping from "../../nessMapping/mapping";
import { Identify } from "./func";
import { logLevel, LogIt } from "../../utils/logs";
import { setSelectedFeatures } from '../../redux/actions/features'
class MapComponent extends React.Component {



  componentDidUpdate() {
    if (this.props.map) {
      this.map = NessMapping.getInstance().getFocusedMap()
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
    Tools: state.Tools
  };
};

export default connect(mapStateToProps, { setSelectedFeatures })(MapComponent);
