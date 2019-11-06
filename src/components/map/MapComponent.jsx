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


class MapComponent extends React.Component {
    constructor(props) {
        super(props)

        this.map = {};
    }

    handleAddTodo(){
        // var proj_2039 = new Projection({
        //     code: 'EPSG:2039',
        //     units: 'm',
        //     axisOrientation: 'neu',
        //     global: false
        //   });
      
        //   var polyEditingVectorSource = new VectorSource({
        //     format: new GeoJSON(),
        //     url:'http://localhost:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3AGANANUTFORGEOSERVER&maxFeatures=100000&outputFormat=application%2Fjson'
        //   });
      
        //   var vectorEditingLayer = new VectorLayer({
        //     source: polyEditingVectorSource,
        //     projection: proj_2039 
        //   });
      
        //   addLayer(vectorEditingLayer);          
    }

    componentDidMount() {
        var a  = new TileLayer({
            source: new OSM()
        })

        this.map = new Map({

            target: 'map',
            view: new View({
                center: [0, 0],
                zoom: 2
            })
        });
    }
    

    componentWillReceiveProps(newProps) {
        if (
          newProps.layers !== this.props.layers &&
          newProps.layers.length > 0
        ) {
            this.map.addLayer(newProps.layers.pop());
        }
    }

    render() {
        console.log(this.props.layers)
        return (
            
            <div>
                <button className="add-todo" onClick={() => {
                 this.handleAddTodo();
              }}>
                    Add Todo
                </button>
                <div>
                    <div id="map" className="map" ref="olmap"></div>
                </div>
            </div>
        )
    }
}
export default (MapComponent);