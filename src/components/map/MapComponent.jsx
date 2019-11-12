import React from 'react';

// Open Layers Imports
import {Tile as TileLayer} from 'ol/layer.js';
import {OSM,} from 'ol/source.js';
import View from 'ol/View.js';
import Map from 'ol/Map.js';
import {Vector as VectorSource} from 'ol/source.js';
import {Projection} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import 'ol/ol.css';
import {Point} from 'ol/geom';
import {addMantiIntersectionLayer} from '../../usefulgarbage/layers';
import {add} from 'ol/coordinate';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style'


class MapComponent extends React.Component {
     constructor(props) {
         super(props)

         this.map = {};
         this.vectorEditingLayer = null;
    }

    handleAddLayer(){
        var proj_2039 = new Projection({
            code: 'EPSG:2039',
            units: 'm',
            axisOrientation: 'neu',
            global: false
          });
      
          var polyEditingVectorSource = new VectorSource({
            format: new GeoJSON(),
            url:'http://lbshayna1-7.muni.jerusalem.muni.il:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3A&maxFeatures=100000&outputFormat=application%2Fjson'
          });
      
          this.vectorEditingLayer = new VectorLayer({
            source: polyEditingVectorSource,
            projection: proj_2039 
          });

          this.map.addLayer(this.vectorEditingLayer);
      
          //this.props.addLayer(vectorEditingLayer);          
    }

    componentDidMount() {
        var a  = new TileLayer({
            source: new OSM()
        })

        this.map = new Map({

            target: 'map',
            view: new View({
                center: [222000,635000],
                zoom: 12
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
            // we ignore the first frame because it's topic
            message.popString();
            // if(message.popString() != "" && message.popString() != 'chat')
            //     alert(message.popString());
            var m = message.popString();

            console.log(m);

            // todo: protect json parsing
            that.changeStatusFromServer(JSON.parse(m));
            //that.map.render();
        };
    }

    changeStatusFromServer = (message) => {
        
        var lyr = this.vectorEditingLayer;

        if (lyr) {            
            var ftrs = lyr.getSource().getFeatures();
            var f = ftrs.find(function(feature) {
                return feature.values_['NUM'] == message['id'];
            });

            if (f) {
                // var styleOFFL = new Style( {
                //     image: new CircleStyle( {
                //         radius: 10,
                //         fill: new Fill( {
                //             color: 'black'
                //         } )
                //     } )
                // } );
                // var coordinate = f.getGeometry().getCoordinates();
                // add(coordinate, [10, 10]);
                // f.setGeometry(new Point(coordinate));
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
              <button onClick={() => { this.handleAddLayer(); }} > 
              Gardens
              </button> 
              <div id="map" className="map" ref="olmap"></div>
            </div>
        )
    }
}
export default (MapComponent);