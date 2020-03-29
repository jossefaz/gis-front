import LayerList from "../components/layers/LayerList"

class VisibleLayerList extends Component {
    state = {  }
    render() { 
        return (  
            <div><LayerList></LayerList>
            </div>
        );
    }
}
 

const mapStateToProps = state =>  {
    return {
        layers: state.mapLayers.layers 
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
  )(VisibleLayerList);
  
