import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { getFocusedMap } from '../nessMapping/api'
import Draw from "ol/interaction/Draw";
export const getEmptyVectorLayer = () => {
    const source = new VectorSource();
    const vector = new VectorLayer({
        source: source,
        style: new Style({
            fill: new Fill({
                color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new Stroke({
                color: "#ffcc33",
                width: 2,
            }),
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: "#ffcc33",
                }),
            }),
        }),
    });
    return { source, vector };
};

export const getDrawObject = (source, type) => {
    return new Draw({
        source: source,
        type: type,
        style: new Style({
            fill: new Fill({
                color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new Stroke({
                color: "rgba(0, 0, 0, 0.5)",
                lineDash: [10, 10],
                width: 2,
            }),
            image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                    color: "rgba(0, 0, 0, 0.7)",
                }),
                fill: new Fill({
                    color: "rgba(255, 255, 255, 0.2)",
                }),
            }),
        }),
    });
};

export const newDraw = (drawType, vectorSource, Layer) => {
    if (!vectorSource) {
        const { source, vector } = getEmptyVectorLayer();
        getFocusedMap().addLayer(vector)
        vectorSource = source
        Layer = vector
    }
    const Interaction = getDrawObject(vectorSource, drawType)
    return { Interaction, vectorSource, Layer };
}
