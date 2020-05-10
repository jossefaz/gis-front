import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { getFocusedMap } from '../nessMapping/api'
import mapStyle from '../nessMapping/mapStyle'
import { Draw, DragBox, Select } from "ol/interaction";

export const getEmptyVectorLayer = (inStyle) => {
    const style = inStyle || mapStyle.draw
    const source = new VectorSource();
    const vector = new VectorLayer({ source, style });
    return { source, vector };
};

export const getDrawObject = (source, type) => {
    return new Draw({
        source: source,
        type: type,
        style: mapStyle.DRAW_START
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

export const newSelect = (config) => {
    if (config) {
        return new Select(config);
    }
    return new Select();
}

export const newDragBox = (config) => {
    if (config) {
        return new DragBox(config);
    }
    return new DragBox();
}