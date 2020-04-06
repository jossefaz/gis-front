import React from "react";
import { InitMap } from '../../utils/Map'
import config from 'react-global-configuration';
import {logLevel, LogIt} from '../../utils/logs'
import './style.css'
class MapComponent extends React.Component {
  constructor(props) {
        super(props);       
        this.map = {};
    }
  componentDidMount() {
    this.map = InitMap();
    LogIt(logLevel.INFO, "Map init" )
    LogIt(logLevel.DEBUG, this.map )
  }
  render() {
    const {target} = config.get("MapConfig")
    return <div id={target} className="map"></div>;
  }
}
export default MapComponent;