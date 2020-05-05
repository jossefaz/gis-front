import { formatArea, formatLength } from '../../../../utils/format'
import { LineString, Polygon } from 'ol/geom';
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { random_rgba } from "../../../../utils/func"
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


export const generateNewStyle = () => {
    return new Style({
        fill: new Fill({
            color: "rgba(154, 111, 222, 0.2)",
        }),
        stroke: new Stroke({
            color: random_rgba(),
            width: 2,
        }),
    })
}




