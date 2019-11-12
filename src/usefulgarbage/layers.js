import {
    Vector as VectorSource
} from 'ol/source.js';
import {
    Projection
} from 'ol/proj';
import {
    Vector as VectorLayer
} from 'ol/layer.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style'


export function addMantiIntersectionLayer() {


    var proj_2039 = new Projection({
        code: 'EPSG:2039',
        units: 'm',
        axisOrientation: 'neu',
        global: false
    });

    var polyEditingVectorSource = new VectorSource({
        format: new GeoJSON(),
        url: 'http://lbshayna1-7.muni.jerusalem.muni.il:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3AZOMETMANTI&maxFeatures=1000&outputFormat=application%2Fjson'
    });


    polyEditingVectorSource.on('change', function () {
        if (polyEditingVectorSource.getState() == 'ready') {

            polyEditingVectorSource.getFeatures().forEach(feature => {
                feature.values_["Offset"] = 0;
                feature.values_["FB"] = 2;
                feature.values_["PH"] = 8;
                feature.values_["CSTAT"] = "CPS";
                feature.values_["PLAN"] = 2;
                feature.values_["CYC"] = 60;
                feature.values_["trn_fdbk"] = "208";
                feature.values_["nCyc"] = 9;
                feature.values_["cycCntDn"] = 53;
                feature.values_["line"] = 23;
                feature.values_["addr"] = "2  ";
                feature.values_["tr_att"] = 60;
                feature.values_["n_valid"] = 60;
                feature.values_["err"] = 0;
                feature.values_["fail"] = 0;
                feature.values_["p_valid"] = 100;
            });

        }
    });

    var vectorEditingLayer = new VectorLayer({
        source: polyEditingVectorSource,
        projection: proj_2039,
        style : function(feature, resolution){
            var styleOL = new Style( {
                image: new CircleStyle( {
                    radius: 10,
                    fill: new Fill( {
                        color: 'green'
                    } )
                } )
            } );
            var styleCPS = new Style( {
                image: new CircleStyle( {
                    radius: 10,
                    fill: new Fill( {
                        color: 'blue'
                    } )
                } )
            } );

            var styleOFFL = new Style( {
                image: new CircleStyle( {
                    radius: 10,
                    fill: new Fill( {
                        color: 'black'
                    } )
                } )
            } );

            var styleFAIL = new Style( {
                image: new CircleStyle( {
                    radius: 10,
                    fill: new Fill( {
                        color: 'red'
                    } )
                } )
            } );

            switch (feature.get('CSTAT')) {
                case 'OL':
                    return [styleOL];
                case 'CPS':
                    return [styleCPS];
                case 'FAIL':
                    return [styleFAIL]
                default:
                    return [styleOFFL];              
            } 
        }
    });

    return vectorEditingLayer;
}

// export function changeFeatureCSTAT(Lyr,Index,CSTATVal){
//    if(Lyr.getFeatures().length > 0){
//        Lyr.getFeatures()[Index].set('CSTAT') = CSTATVal;
//    }
// }

export var subscribeToServer = function(){
    var topic = "chat";
   
    var subscriber = new window.JSMQ.Subscriber();
    subscriber.connect("ws://yonib1-7.muni.jerusalem.muni.il:81");

    subscriber.subscribe(topic);

    subscriber.onMessage = function (message) {
        // we ignore the first frame because it's topic
        message.popString();

        console.log(message.popString());

        
    };
}

 



