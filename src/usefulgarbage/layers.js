import {
    Vector as VectorSource
} from 'ol/source.js';
import {
    Projection
} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import {Point} from 'ol/geom';
import {WMTS} from 'ol/source.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';


export function addMantiIntersectionLayer() {


    var proj_2039 = new Projection({
        code: 'EPSG:2039',
        units: 'm',
        axisOrientation: 'neu',
        global: false
    });

    var proj_3857 = new Projection({
        code: 'EPSG:3857',
        units: 'm',
        axisOrientation: 'neu',
        global: true
    });

    var polyEditingVectorSource = new VectorSource({
        format: new GeoJSON(),
        url: 'http://lbshayna1-7.muni.jerusalem.muni.il:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3AZOMETMANTI&maxFeatures=1000&outputFormat=application%2Fjson'
    });


    polyEditingVectorSource.on('change', function () {
        if (polyEditingVectorSource.getState() == 'ready') {

            polyEditingVectorSource.getFeatures().forEach(feature => {
                // var coordinate = feature.getGeometry().getCoordinates();
                // feature.setGeometry(new Point(Projection.transform(coordinate, 'EPSG:2039', 'EPSG:3857')));

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
        projection: proj_3857,
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

export var changeStatusFromServer = (message) => {

    var lyr = this.vectorEditingLayer;

    if (lyr) {
        var ftrs = lyr.getSource().getFeatures();
        var f = ftrs.find(function (feature) {
            return feature.values_['NUM'] === message['id'];
        });

        if (f) {
            var st = lyr.getStyleFunction();
            f.setProperties(message, true);
            f.setStyle(st.apply(this, [f]));
        }
    }
}

export var constructSource  = () => {

    var proj_2039 = new Projection({
        code: 'EPSG:2039',
        units: 'm',
        axisOrientation: 'neu',
        global: false
    });


    var gridsetName = 'Jeru_ESPG:2039';
    var gridNames = ['128000', '64000', '32000', '16000', '8000', '4000', '2000', '1000', '500', '250'];
    var baseUrl = 'http://yonib1-7.muni.jerusalem.muni.il:8080/geoserver/gwc/service/wmts';
    var style = '';
    var format = 'image/jpeg';
    var infoFormat = 'text/html';
    var layerName = 'jeruPOC:jeru2018';
    var projection = proj_2039;

    var resolutions = [35.839999999999996, 17.919999999999998, 8.959999999999999, 4.4799999999999995, 2.2399999999999998, 1.1199999999999999, 0.5599999999999999, 0.27999999999999997, 0.13999999999999999, 0.06999999999999999];
    var baseParams = ['VERSION', 'LAYER', 'STYLE', 'TILEMATRIX', 'TILEMATRIXSET', 'SERVICE', 'FORMAT'];

    var params = {
        'VERSION': '1.0.0',
        'LAYER': layerName,
        'STYLE': style,
        'TILEMATRIX': gridNames,
        'TILEMATRIXSET': gridsetName,
        'SERVICE': 'WMTS',
        'FORMAT': format
    };



    var url = baseUrl + '?'
    for (var param in params) {
        if (baseParams.indexOf(param.toUpperCase()) < 0) {
            url = url + param + '=' + params[param] + '&';
        }
    }
    url = url.slice(0, -1);


    var RasterSource = new WMTS({
        url: url,
        layer: params['LAYER'],
        matrixSet: params['TILEMATRIXSET'],
        format: params['FORMAT'],
        projection: projection,
        tileGrid: new WMTSTileGrid({
            tileSize: [256, 256],
            extent: [207000.0, 624000.0, 234525.12, 651525.12],
            origin: [207000.0, 651525.12],
            resolutions: resolutions,
            matrixIds: params['TILEMATRIX']
        }),
        style: 'raster',
        wrapX: true
    });
    var rasterLayer = new TileLayer({
        source: RasterSource
    });
    return rasterLayer
}

   // var baseMapLayer = new TileLayer({
        //     'LAYERS': "show:1",
        //     extent: [-13884991, 2870341, -7455066, 6338219],
        //     source: new TileArcGISRest({
        //         // url: "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer",
        //         url: "http://ntgisarc12/arcgis/rest/services/Ortho2018/MapServer"

        //     })

        // });
        //this.map.addLayer(this.constructSource());


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

 



