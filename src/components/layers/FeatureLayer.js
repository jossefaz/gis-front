import GeoJSON from 'ol/format/GeoJSON.js';
import {
    Vector as VectorLayer
} from 'ol/layer.js';
import {
    Vector as VectorSource
} from 'ol/source';

import {
    sourceFormat,
    projection
} from '../../configuration/FeatureLayerDefaults.js'

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
                // features: _features,
                url: props.url != null ? props.url : null,
                format: props.format != null ? props.format : sourceFormat,

            });

            if (props.idKey != null)
                vectorSource.once('change', function (e) {
                    if (vectorSource.getState() === 'ready') {
                        setIds(props.idKey);
                    }
                });

            _vectorLayer = new VectorLayer({
                source: vectorSource,
                projection: props.projection != null ? props.projection : projection,
                style: props.style != null ? props.style : null
            });

        }

        return {
            vl: _vectorLayer,
            drawSymbolgy: drawSymbolgy,
            setProperties: setProperties,
            setIds: setIds,
            filter: filter
        }
    };

    var setIds = (idKey) => {

        if (_vectorLayer && _vectorLayer.getSource().getFeatures().length > 0) {
            _vectorLayer.getSource().getFeatures().map((feature) => {
                feature.setId(feature.values_[idKey]);
            });
        }
    }

    var setProperties = (data, props) => {
        var lyr = _vectorLayer;

        if (data != null && data.length > 0) {

            var targetId = props.targetId;
            var sourceId = props.sourceId;

            if (lyr) {
                var st = lyr.getStyleFunction();
                var ftrs = lyr.getSource();

                data.map(function (sourceItem) {

                    var id = parseInt(sourceItem[sourceId]);
                    var f = ftrs.getFeatureById(id)
                    if (f) {
                        console.log("was set!");
                        f.set("cstat", sourceItem["CSTAT"]);
                    }
                });

            }
        }
    }

    var filter = (expression) => {
        var lyr = _vectorLayer;
        var ftrs = lyr.getSource().getFeatures();
        var f = ftrs.filter(function (feature) {
            return feature.values_["CSTAT"] === "FAIL";
        });

        lyr.setSource()
    }

    var drawSymbolgy = (data, props) => {

        var lyr = _vectorLayer;

        if (data && data.sourceArray) {

            var targetId = props.targetId;
            var sourceId = props.sourceId;

            if (lyr) {

                var st = lyr.getStyleFunction();
                var ftrs = lyr.getSource().getFeatures();


                data.sourceArray.map(function (sourceItem) {

                    var f = ftrs.find(function (feature) {
                        return feature.values_[targetId] === sourceItem[sourceId];
                    });

                    if (f) {
                        f.setStyle(st.apply(this, [f]));
                    }
                });
            }
        }
    }

    return FeatureLayer;
})();