import GeoJSON from 'ol/format/GeoJSON.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {Vector as VectorSource} from 'ol/source';

import {sourceFormat,projection} from '../../configuration/FeatureLayerDefaults.js'

export var FeatureLayer =  (function() {
    var _this = null;
    var _props = null;
    var _source = null;  
    var _vectorLayer = null;
  
    function FeatureLayer(source ,props) {
      _this = this;   
      _props = props;
      _source = source;

      console.log("props:" + props);
      console.log("source:" + source);

      if(source != null){
         var vectorSource = new VectorSource({
            features : source,
            format : props.format != null ?  props.format : sourceFormat,
         });

         _vectorLayer = new VectorLayer({
            source: vectorSource,
            projection: props.projection != null ?  props.projection : projection
        });
      }

      return {
          vl : _vectorLayer,
          drawSymbolgy: drawSymbolgy,
        
      }
    };

    function drawSymbolgy() {
        console.log('drawSymbolgy');
    }

    return FeatureLayer;
})();