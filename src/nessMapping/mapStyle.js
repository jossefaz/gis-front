import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
const _drawstyle = new Style({
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
})

const _highlight = new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new Stroke({
        color: '#319FD3',
        width: 1
    }),
    image: new CircleStyle({
        radius: 5,
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new Stroke({
            color: '#319FD3',
            width: 1
        })
    })
});


export default {
    DRAW: _drawstyle,
    HIGHLIGHT: _highlight
}
