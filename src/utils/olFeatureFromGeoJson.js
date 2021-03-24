import GeoJSON from "ol/format/GeoJSON";

const olFeatureFromFepoJson = (geoJson, properties) => {
  const olFeature = new GeoJSON().readFeatures(geoJson);
  return olFeature[0];
};
export default olFeatureFromFepoJson;
