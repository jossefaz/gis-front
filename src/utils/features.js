import { getFocusedMap, getCurrentExtent } from "../nessMapping/api";
import { Image as ImageLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { bbox } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { projIsrael } from "./projections";
import axios from "axios";
import { getHeight, getWidth } from "ol/extent";
export const getCurrentLayersSource = () => {
  const sources = [];
  getFocusedMap()
    .getLayers()
    .getArray()
    .map((lyr) => {
      if (lyr instanceof ImageLayer) {
        const vectorSource = new VectorSource({
          loader: () => {
            axios
              .get(lyr.getSource().getUrl(), {
                params: {
                  service: "WMS",
                  version: "1.1.0",
                  request: "GetMap",
                  layers: lyr.getSource().getParams().LAYERS,
                  bbox: getCurrentExtent().join(","),
                  srs: lyr.getSource().getParams().SRS,
                  format: "geojson",
                  width: getFocusedMap().getSize()[0],
                  height: getFocusedMap().getSize()[1],
                },
              })
              .then((res) => {
                vectorSource.addFeatures(
                  vectorSource.getFormat().readFeatures(res.data)
                );
              });
          },
          format: new GeoJSON({
            dataProjection: projIsrael,
          }),
          strategy: bbox,
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
