import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {getWidth, getTopLeft} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import {get as getProjection, Projection} from 'ol/proj';
import OSM from 'ol/source/OSM';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';


export var  baseMap = () =>{

var gridsetName = 'ESPG:2039';
var gridNames = ['128000', '64000', '32000', '16000', '8000', '4000', '2000', '1000', '500', '250','100'];
//var baseUrl = '../service/wmts';
var style = '';
var format = 'image/jpeg';
var infoFormat = 'text/html';
var layerName = '0';
var projection = new Projection({
  code: 'EPSG:2039',
  units: 'm',
  axisOrientation: 'neu'
});
var resolutions = [35.839999999999996, 17.919999999999998, 8.959999999999999, 4.4799999999999995, 2.2399999999999998, 1.1199999999999999, 0.5599999999999999, 0.27999999999999997, 0.13999999999999999, 0.06999999999999999];
var baseParams = ['VERSION','LAYER','STYLE','TILEMATRIX','TILEMATRIXSET','SERVICE','FORMAT'];

var params = {
  'VERSION': '1.0.0',
  'LAYER': layerName,
  'STYLE': style,
  'TILEMATRIX': gridNames,
  'TILEMATRIXSET': gridsetName,
  'SERVICE': 'WMTS',
  'FORMAT': format
};

var jeru2018_source = new WMTS({
//   url: 'http://yonib1-7.muni.jerusalem.muni.il:8080/geoserver/gwc/service/wmts',
  url : 'https://ntgisarc12.muni.jerusalem.muni.il/arcgis/rest/services/Ortho2014/MapServer/WMTS/tile/1.0.0/Ortho2014/',
  layer: params['LAYER'],
  matrixSet: params['TILEMATRIXSET'],
  format: params['FORMAT'],
  projection: projection,
  tileGrid: new WMTSTileGrid({
    tileSize: [256,256],
    extent: [207000.0,624000.0,234525.12,651525.12],
    origin: [207000.0, 651525.12],
    resolutions: resolutions,
    matrixIds: params['TILEMATRIX']
  }),
  style: params['STYLE'],
  wrapX: true
});

var tileLayer =     new TileLayer({

    source: jeru2018_source
  })


return tileLayer
}