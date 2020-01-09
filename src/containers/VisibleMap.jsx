import React from 'react';
import { connect } from 'react-redux';
import MapComponent from '../components/map/MapComponent';
import { bindActionCreators } from 'redux'
import  {addLayer,updateFeatureAttributes}  from "../redux/actions/actions";
import {Vector as VectorSource} from 'ol/source.js';
import {Projection} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {addMantiIntersectionLayer} from '../usefulgarbage/layers'
import {geoJsonMantiIntersection} from '../usefulgarbage/mantiInter.js'
//import {manti_inte} from '../usefulgarbage/manti_inte.json';
import  {selectUnits}  from "../redux/selectors/unitsSelector";
import {
    UPDATE_FEATURE_ATTRIBUTES,
    UPDATE_PUBLISHED_STATUS   
  } from '../redux/actions/actionsTypes';



class VisibleMap extends React.Component {
    constructor(props) {
        super(props)
        
    }   
    
  
    updateFeartures =() =>{
        this.props.updateFeatureAttributes([{
            "unit-id": 340,
            "changes": [{
                "field-name": "Status",
                "value": "FAIL"
            },
            {
                "field-name": "Time",
                "value": "2019222"
            }]
        },
        {
            "unit-id": 580,
            "changes": [{
                "field-name": "Status",
                "value": "FAIL"
            },
            {
                "field-name": "Time",
                "value": "2019222"
            }]
        }],"units","unit-id","unit-id","changes", "field-name","value");
        console.log(this.props);

    }

    handleAddLayer = () =>{

        console.log('trying toadd a layer!!!!!!');
        
        
        var proj_2039 = new Projection({
            code: 'EPSG:2039',
            units: 'm',
            axisOrientation: 'neu',
            global: false
        });
      
        var polyEditingVectorSource = new VectorSource({
           // format: new GeoJSON(),
           // url: geoJsonMantiIntersection,
            features: (new GeoJSON()).readFeatures(geoJsonMantiIntersection)
            //'http://localhost:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3AFAMILY_HEALTH_CENTER&maxFeatures=50&outputFormat=application%2Fjson'
        });
      
        var vectorEditingLayer = new VectorLayer({
          source: polyEditingVectorSource,
          projection: proj_2039 
        });
        console.log("vectorEditingLayer declared");
        console.log('as of now the layers are:' + this.props.layers);
        this.props.addLayer(vectorEditingLayer);          
    }


    handleAddTzmatimLayer = () =>{
        this.props.addLayer(addMantiIntersectionLayer());   

    }
    handleChangeStatusTzmet = () => {
        var ftrs = this.props.layers[1].getSource().getFeatures();
        if(ftrs.length > 0){
            ftrs[0].values_['CSTAT'] = 'FAIL';
        }
    }

   
    
    render() {

        return (
            <div>
              <button  onClick={() => { this.handleAddLayer(); }} > 
              Health Center
              </button>
              <button  onClick={() => { this.updateFeartures(); }} > 
              update Feartures
              </button>
              <button  onClick={() => { this.handleAddTzmatimLayer(); }} > 
              צמתים
              </button>
              <button  onClick={() => { this.handleChangeStatusTzmet(); }} > 
              שנה סטטוס צומת
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

// const mapDispatchToProps = (dispatch) => {    
//     return {
//       addLayerParent: (layer) => dispatch(addLayer(layer))
//     };
// };

const updatePublishedStatus = () => ({ type: 'UPDATE_PUBLISHED_STATUS' })


const mapDispatchToProps = dispatch => {
  return {
    // dispatching actions returned by action creators
    updatePublishedStatus: () => dispatch(updatePublishedStatus())
  }
}

export default connect(
    mapStateToProps,
   // [addLayer,updateFeatureAttributes,updatePublishedStatus],
    mapDispatchToProps,
    null 
)(VisibleMap);


