import { getFocusedMap } from "../nessMapping/api";
import { Image as ImageLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import GeoJSON from "ol/format/GeoJSON";
import { projIsrael } from "./projections";

export const getCurrentLayersSource = () => {
  const sources = [];
  getFocusedMap()
    .getLayers()
    .getArray()
    .map((lyr) => {
      if (lyr instanceof ImageLayer) {
        const vectorSource = new VectorSource({
          url: `${lyr
            .getSource()
            .getUrl()}?service=WMS&version=1.1.0&request=GetMap&layers=Jeru%3Adimigcompile&bbox=208971.15625%2C628413.125%2C224400.078125%2C634831.9375&width=768&height=330&srs=EPSG%3A2039&styles=&format=geojson`,
          format: new GeoJSON({
            dataProjection: projIsrael,
          }),
        });
        getFocusedMap().addLayer(
          new VectorLayer({
            source: vectorSource,
            opacity: 0,
          })
        );
        sources.push(vectorSource);
      }
    });
  return sources;
};

export const getFeaturesByExtent = (extent, sources) => {
  const features = [];
  sources.map((vs) => {
    vs.forEachFeatureInExtent(extent, (feature) => {
      features.push(feature);
    });
    getFocusedMap().removeLayer(vs);
  });
  return features;
};
