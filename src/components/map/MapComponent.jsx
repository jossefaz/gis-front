import React from 'react';

// Open Layers Imports
import {Tile as TileLayer} from 'ol/layer.js';
import {OSM,} from 'ol/source.js';
import View from 'ol/View.js';
import Map from 'ol/Map.js';
import 'ol/ol.css';


class MapComponent extends React.Component {
    constructor(props) {
        super(props)

        this.map = {};
    }


    componentDidMount() {

        this.map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            target: 'map',
            view: new View({
                center: [0, 0],
                zoom: 2
            })
        });
    }


    
    // addLayer = layer => {
        
    // }


    render() {
        console.log(this.props.layers)
        return (
            
            <div>
                <div>
                    <div id="map" className="map" ref="olmap"></div>
                </div>
            </div>
        )
    }
}
export default (MapComponent);