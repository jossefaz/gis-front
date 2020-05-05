import { formatArea, formatLength } from '../../../../utils/format'
import { LineString, Polygon } from 'ol/geom';

export const generateOutput = (evt, tooltipCoord) => {
    const geom = evt.target;
    let output;
    if (geom instanceof Polygon) {
        output = formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof LineString) {
        output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
    }
    return { output, tooltipCoord }
}