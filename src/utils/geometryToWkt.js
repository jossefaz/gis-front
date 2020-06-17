import WKT from 'ol/format/WKT';

export const getWKTFromOlGeom = (olgeom) => {

    const format = new WKT()

    return format.writeFeature(olgeom)

}