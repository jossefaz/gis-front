import { Image as ImageLayer } from "ol/layer";
import axios from "axios";




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
            feature_count: 100,
          });
        if (url) {
          axios.get(url).then((response) => {
            actionCB(response.data.features);
          });
        }
      }
    });
};

