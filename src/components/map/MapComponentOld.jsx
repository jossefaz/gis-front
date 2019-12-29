import React from 'react';

// Open Layers Imports
import {Tile as TileLayer} from 'ol/layer.js';
//import TileLayer from 'ol/layer/Tile';
import View from 'ol/View.js';
import Map from 'ol/Map.js';
import {
    TileArcGISRest,
    OSM,
    XYZ,
    Vector as VectorSource,
    WMTS
} from 'ol/source.js';
import {
    Projection
} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import {
    Vector as VectorLayer
} from 'ol/layer.js';
import 'ol/ol.css';
import {
    Point
} from 'ol/geom';
import {addMantiIntersectionLayer,changeStatusFromServer} from '../../usefulgarbage/layers';
import {
    add
} from 'ol/coordinate';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { tsMethodSignature } from '@babel/types';
import {baseMap} from '../../usefulgarbage/baseMap';


class MapComponent extends React.Component {
    constructor(props) {
        super(props)


        this.state = { messages: [] };

        this.map = {};
        this.vectorEditingLayer = null;

        this.proj_2039 = new Projection({
            code: 'EPSG:2039',
            units: 'm',
            axisOrientation: 'neu',
            global: false
        });
    }

    handleAddLayer() {


        var polyEditingVectorSource = new VectorSource({
            format: new GeoJSON(),
            url: 'http://lbshayna1-7.muni.jerusalem.muni.il:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3A&maxFeatures=100000&outputFormat=application%2Fjson'
        });

        this.vectorEditingLayer = new VectorLayer({
            source: polyEditingVectorSource,
            projection: this.proj_2039
        });
        this.map.addLayer(this.vectorEditingLayer);

    }

    componentDidMount() {

        var projection = new Projection({
            code: 'EPSG:2039',
            units: 'm',
            axisOrientation: 'neu'
        });
        
        this.map = new Map({

            target: 'map',
            view: new View({
                center: [207000, 624000],
                zoom: 12,
                extent: [207000.0,624000.0,234525.12,651525.12],
                // projection : projection
            })
        });

        this.vectorEditingLayer = addMantiIntersectionLayer();
        this.map.addLayer(this.vectorEditingLayer);
        
        this.subscribeToServer();
    }
    componentWillReceiveProps(newProps) {
        // if (
        //   newProps.layers !== this.props.layers &&
        //   newProps.layers.length > 0
        // ) {
        //     var layers = [...newProps.layers];
        //     this.map.addLayer(layers.pop());
        // }
    }

    subscribeToServer = () => {
        var that = this;
        var topic = "chat";

        var subscriber = new window.JSMQ.Subscriber();
        subscriber.connect("ws://yonib1-7.muni.jerusalem.muni.il:81");
        subscriber.subscribe(topic);
        subscriber.onMessage = function (message) {      
            message.popString();            
            var m = message.popString();
            console.log('message to layer: ' + m);
            that.changeStatusFromServer(JSON.parse(m));
            that.showFails(JSON.parse(m))
        };

        // var reduxSubscriber = new window.JSMQ.Subscriber();
        // reduxSubscriber.connect("ws://yonib1-7.muni.jerusalem.muni.il:81");
        // reduxSubscriber.subscribe(topic);
        // reduxSubscriber.onMessage = function (message) {         
        //     message.popString();         
        //     var m = message.popString();
        //     console.log('message to redux: ' + m);         
        // };
    }

    showFails = (message) => {
       if(message['CSTAT'] == 'FAIL')
         this.setState({ messages : [...this.state.messages,message]})
    }

    changeStatusFromServer = (message) => {

        var lyr = this.vectorEditingLayer;
    
        if (lyr) {
            var ftrs = lyr.getSource().getFeatures();
            var f = ftrs.find(function (feature) {
                return feature.values_['NUM'] == message['id'];
            });
    
            if (f) {
                var st = lyr.getStyleFunction();
                f.setProperties(message, true);
                f.setStyle(st.apply(this, [f]));
            }
        }
    }
    

    render() {
        console.log("our layers:" + this.props.layers)
        return (
            <div>
            <button onClick = {() => {this.handleAddLayer();}}>Gardens</button>
            {/* <div>
      
               {this.state.messages.map(message=> (
                
                       <li>
                           {message.id}
                       </li>
                     
                
                ))}
            </div> */}
            <div id = "map" className = "map" ref = "olmap"> </div>
            </div>
        )
    }
}
export default (MapComponent);