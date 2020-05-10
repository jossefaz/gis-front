import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
const _drawEndstyle = new Style({
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

const _drawStartStyle = new Style({
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
    DRAW_START: _drawStartStyle,
    DRAW_END: _drawEndstyle,
    HIGHLIGHT: _highlight
}