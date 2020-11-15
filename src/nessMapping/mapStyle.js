import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { MultiPoint, MultiPolygon } from "ol/geom";
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
});

const _drawStartStyle = new Style({
  fill: new Fill({
    color: "rgba(255, 255, 255, 0.2)",
  }),
  stroke: new Stroke({
    color: "#ffcc33",
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({
      color: "#ffcc33",
    }),
  }),
});
const _highlight = new Style({
  fill: new Fill({
    color: "rgba(255, 255, 255, 0.6)",
  }),
  stroke: new Stroke({
    color: "#319FD3",
    width: 1,
  }),
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({
      color: "rgba(255, 255, 255, 0.6)",
    }),
    stroke: new Stroke({
      color: "#319FD3",
      width: 1,
    }),
  }),
});

const _editStyle = [
  // style for the polygon
  new Style({
    stroke: new Stroke({
      color: "blue",
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  // style for the vertices
  new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: "orange",
      }),
    }),
    geometry: function (feature) {
      var coordinates = feature.getGeometry().getCoordinates()[0];
      return new MultiPoint(coordinates);
    },
  }),
];

const _hiddenStyle = new Style({
  fill: new Stroke({
    color: "transparent",
  }),
});

export default {
  DRAW_START: _drawStartStyle,
  DRAW_END: _drawEndstyle,
  HIGHLIGHT: _highlight,
  HIDDEN: _hiddenStyle,
  EDIT: _editStyle,
};
