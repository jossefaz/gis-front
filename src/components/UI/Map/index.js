import React from "react";
import { InitMap } from './func'
import config from 'react-global-configuration';
import {logLevel, LogIt} from '../../../utils/logs';
import {Image as ImageLayer} from 'ol/layer';
import ImageWMS from 'ol/source/ImageWMS';
import './style.css'
class MapComponent extends React.Component {
  constructor(props) {
        super(props);       
        this.map = null;
    }
  componentDidMount() {
    this.map = InitMap();
    LogIt(logLevel.INFO, "Map init" )
    LogIt(logLevel.DEBUG, this.map )
    const customlayers = config.get('layers')
    customlayers.map(lyr => {
      const newLyr = new ImageLayer({source : new ImageWMS(lyr)});
      this.map.addLayer(newLyr)
      
    })
  }

  render() {
    const {target} = config.get("MapConfig")
    return <div id={target} className="map"></div>;
  }
}
export default MapComponent;