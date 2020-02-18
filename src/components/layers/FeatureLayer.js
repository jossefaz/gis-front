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
    
      if(source != null){
         var vectorSource = new VectorSource({
            features : source,
            format : props.format != null ?  props.format : sourceFormat,
        
         });

         _vectorLayer = new VectorLayer({
            source: vectorSource,
            projection: props.projection != null ?  props.projection : projection,
            style : props.style != null ? props.style : null
        });
      }

      return {
          vl : _vectorLayer,
          drawSymbolgy : drawSymbolgy,
          setProperties : setProperties        
      }
    };


    var setProperties = (data,props) => {
        var lyr = _vectorLayer;
        
        if(data != null && data.length > 0){
            
            var targetId = props.targetId;
            var sourceId = props.sourceId;     

            if (lyr) {

                var ftrs = lyr.getSource().getFeatures();
                    
                    
                data.map(function(sourceItem){

                    var id =  parseInt(sourceItem[sourceId]);
                
                    var f = ftrs.find(function (feature) {                      
                        return feature.values_[targetId] == id;
                    });

                    if (f) {                                                
                        f.set("CSTAT",  sourceItem["CSTAT"]);                        
                    }
                });              
            }
        }

    }

    var drawSymbolgy = (data,props) => {
        
        var lyr = _vectorLayer;
        
        if(data && data.sourceArray){
            
            var targetId = props.targetId;
            var sourceId = props.sourceId;

            if (lyr) {
                
                var st = lyr.getStyleFunction();
                var ftrs = lyr.getSource().getFeatures();
                
                
                data.sourceArray.map(function(sourceItem){
                    
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