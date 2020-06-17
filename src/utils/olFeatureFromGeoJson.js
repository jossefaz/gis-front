import GeoJSON from 'ol/format/GeoJSON';

export default (geoJson, properties) => {
    const olFeature = new GeoJSON().readFeatures(geoJson)
    return olFeature[0]

}