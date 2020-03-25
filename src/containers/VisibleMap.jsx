import React from 'react';
import { connect } from 'react-redux';
import MapComponent from '../components/map/MapComponent';
import  {addLayer,}  from "../redux/actions/actions";
import {Projection} from 'ol/proj';
import {addMantiIntersectionLayer} from '../usefulgarbage/layers';
import  {selectUnits}  from "../redux/selectors/mantiSystemsSelector";
import {FeatureLayer} from '../components/layers/FeatureLayer.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {geoJsonMantiIntersection} from '../usefulgarbage/mantiInter.js';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import {loadChannels , onMessageRecived}  from '../comm/communicationManager.js'
import LayerList from '../components/layers/LayerList';

const  styleFunction = function(feature, resolution){
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

class VisibleMap extends React.Component {
    constructor(props) {
        super(props)
    }

    handleAddLayer = () =>{
        
        var proj_2039 = new Projection({
            code: 'EPSG:2039',
            units: 'm',
            axisOrientation: 'neu',
            global: false
        });
        
        var fl = new FeatureLayer(new GeoJSON().readFeatures(geoJsonMantiIntersection),{
            format : new GeoJSON(),
            style : styleFunction
        });  

        console.log("vectorEditingLayer declared");
        console.log('as of now the layers are:' + this.props.layers);
        this.props.addLayer(fl);        
        loadChannels();  
    }
    
    render() {

        return (
            <div>
              <button  onClick={() => { this.handleAddLayer(); }} > 
               Add manti intersections
              </button>
              <MapComponent layers={this.props.layers}   
             addLayer={this.props.addLayer} 
             updatePublishedStatus = {this.props.updatePublishedStatus}
             units={this.props.units}></MapComponent>                              
        </div>
        )
    }
}

const mapStateToProps = state =>  {
    return {
        layers: state.mapLayers.layers,
        units : selectUnits(state)
    }    
}




const mapDispatchToProps = dispatch => {
  return {
    // dispatching actions returned by action creators
    addLayer : (layer) => dispatch(addLayer(layer))
  }
}

export default connect(
    mapStateToProps,   
    mapDispatchToProps,
    null 
)(VisibleMap);


