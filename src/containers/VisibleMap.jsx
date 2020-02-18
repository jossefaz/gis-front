import React from 'react';
import { connect } from 'react-redux';
import MapComponent from '../components/map/MapComponent';
import { bindActionCreators } from 'redux'
import  {addLayer,updateFeatureAttributes,updatePublishedStatus}  from "../redux/actions/actions";
import {Projection} from 'ol/proj';
import {addMantiIntersectionLayer} from '../usefulgarbage/layers';
import  {selectUnits}  from "../redux/selectors/unitsSelector";
import {FeatureLayer} from '../components/layers/FeatureLayer.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {geoJsonMantiIntersection} from '../usefulgarbage/mantiInter.js';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import {loadChannels , onMessageRecived}  from '../comm/communicationManager.js'

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

        console.log('trying toadd a layer!!!!!!');
        
        
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


    handleAddTzmatimLayer = () => {
        this.props.addLayer(addMantiIntersectionLayer());  
    }
    handleChangeStatusTzmet = () => {
        var ftrs = this.props.layers[1].getSource().getFeatures();
        if(ftrs.length > 0){
            ftrs[0].values_['CSTAT'] = 'FAIL';
        }
    }

    sendMessage = () => {
        onMessageRecived (
        [{"Offset":"test","FB":2,"PH":13,"CSTAT":"OL","PLAN":3,"CYC":80,"trn_fdbk":"14320D","nCyc":6,"cycCntDn":59,"line":25,"addr":"1","tr_att":60,"n_valid":60,"err":0,"fail":0,"p_valid":100,"id":"370","LastChangeTime":"2020-01-22T08:54:02.4523236+02:00"}]
        );
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
              <button  onClick={() => { this.sendMessage(); }} > 
              שלח הודעה
              </button>     
              <div >
              <MapComponent layers={this.props.layers}   
             addLayer={this.props.addLayer} 
             updatePublishedStatus = {this.props.updatePublishedStatus}
             units={this.props.units}></MapComponent>              
                 <MapComponent layers={this.props.layers}   
             addLayer={this.props.addLayer} 
             updatePublishedStatus = {this.props.updatePublishedStatus}
             units={this.props.units}></MapComponent> 
             </div>         
           
                 <MapComponent layers={this.props.layers}   
             addLayer={this.props.addLayer} 
             updatePublishedStatus = {this.props.updatePublishedStatus}
             units={this.props.units}></MapComponent> 
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
    updatePublishedStatus: (...params) => dispatch(updatePublishedStatus(params)),
    addLayer : (layer) => dispatch(addLayer(layer))
  }
}

export default connect(
    mapStateToProps,   
    mapDispatchToProps,
    null 
)(VisibleMap);


