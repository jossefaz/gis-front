import { Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource } from "ol/source";

import {
  sourceFormat,
  projection,
} from "../../configuration/FeatureLayerDefaults.js";
import _ from "lodash";

export var FeatureLayer = (function () {
  var _this = null;
  var _props = null;
  var _features = null;
  var _vectorLayer = null;

  function FeatureLayer(features, props) {
    _this = this;
    _props = props;
    _features = features;

    if (features != null || props.url != null) {
      var vectorSource = new VectorSource({
        url: props.url != null ? props.url : null,
        format: props.format != null ? props.format : sourceFormat,
      });

      if (props.geoJoinFieldName != null)
        vectorSource.once("change", function (e) {
          if (vectorSource.getState() === "ready") {
            setIds(props.geoJoinFieldName);
          }
        });

      _vectorLayer = new VectorLayer({
        source: vectorSource,
        projection: props.projection != null ? props.projection : projection,
        style: props.style != null ? props.style : null,
      });
    }

    return {
      vl: _vectorLayer,
      setProperties: setProperties,
      setIds: setIds,
    };
  }

  var setIds = (geoJoinFieldName) => {
    if (_vectorLayer && _vectorLayer.getSource().getFeatures().length > 0) {
      _vectorLayer
        .getSource()
        .getFeatures()
        .map((feature) => {
          feature.setId(feature.values_["adaptorId"] + "." +  feature.values_[geoJoinFieldName] );
        });
    }
  };

  const setProperties = (data, props) => {
    let lyr = _vectorLayer;
    let st = lyr.getStyleFunction();

    if (data != null && data.length > 0) {
      let sourceId = props.sourceId;

      if (lyr) {
        let st = lyr.getStyleFunction();
        let ftrs = lyr.getSource();

        data.forEach(function (sourceItem) {
          let id = sourceItem[sourceId];
          let f = ftrs.getFeatureById(id);

          if (f) {
            for (let prop in sourceItem) {
              if (prop !== "geometry") {
                f.set(prop, sourceItem[prop]);
              }
            }
          }
        });
      }
    }
  };

  return FeatureLayer;
})();
