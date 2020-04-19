import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import {
  ScaleLine,
  ZoomSlider,
  MousePosition,
  OverviewMap,
  FullScreen,
  defaults as DefaultControls,
} from "ol/control";
import OSM from "ol/source/OSM";
import config from "react-global-configuration";
import { Image as ImageLayer } from "ol/layer";
import axios from "axios";

export const InitMap = () => {
  const { proj, center, zoom, target } = config.get("MapConfig");
  return new Map({
    //  Display the map in the div with the id of map
    target: target,
    controls: DefaultControls().extend([
      new ScaleLine(),
      new FullScreen(),
      new ZoomSlider(),
      new OverviewMap({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
      }),
    ]),
    layers: [],
    // Render the tile layers in a map view with a Mercator projection
    view: new View({
      projection: proj,
      center: center,
      zoom: zoom,
    }),
  });
};

export const Identify = (evt, mapObject, actionCB) => {
  var viewResolution = mapObject.getView().getResolution();
  mapObject
    .getLayers()
    .getArray()
    .map((lyr) => {
      if (lyr instanceof ImageLayer && lyr.selectable) {
        var url = lyr
          .getSource()
          .getFeatureInfoUrl(evt.coordinate, viewResolution, "EPSG:4326", {
            INFO_FORMAT: "application/json",
          });
        if (url) {
          axios.get(url).then((response) => {
            actionCB(response.data.features);
          });
        }
      }
    });
};
