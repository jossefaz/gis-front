import React from "react";
import { connect } from "react-redux";
import "./style.css";
import { getFocusedMap } from '../../nessMapping/api'
import { Identify } from "./func";
import { logLevel, LogIt } from "../../utils/logs";
import { setSelectedFeatures } from '../../redux/actions/features'
import { setRaster } from '../../redux/actions/raster'

class MapComponent extends React.Component {



  componentDidUpdate() {
    if (this.props.map) {

      this.map = getFocusedMap()
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
    map: state.map,
    Tools: state.Tools
  };
};

export default connect(mapStateToProps, { setSelectedFeatures, setRaster })(MapComponent);
