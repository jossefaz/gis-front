import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { XYZ as XYZSource } from "ol/source";
import {
  ScaleLine,
  ZoomSlider,
  MousePosition,
  OverviewMap,
  FullScreen,
  defaults as DefaultControls
} from "ol/control";
import OSM from 'ol/source/OSM';
import config from 'react-global-configuration';

export const InitMap = () => {
  const {url, proj, center, zoom, target} = config.get("MapConfig")
  return new Map({
    //  Display the map in the div with the id of map
    target: target,
    controls: DefaultControls().extend([
        new FullScreen(),
        new ZoomSlider(),
        new ScaleLine(),
        new MousePosition(),
        new OverviewMap({
            layers: [
              new TileLayer({
                source: new OSM()
              })
            ]
          })
      ]),
    layers: [
        new TileLayer({
            source: new OSM()
          }),
    ],
    // Render the tile layers in a map view with a Mercator projection
    view: new View({
      projection: proj,
      center: center,
      zoom: zoom
    })
  });
};
