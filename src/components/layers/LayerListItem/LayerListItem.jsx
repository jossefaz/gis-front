import React, { Component } from "react";
import {Tile as TileLayer} from 'ol/layer';
import {TileWMS} from 'ol/source';
class LayerListItem extends Component {
  
  state = {
    layer: null   
  }  

  componentDidMount() {
  
  }

  handleCheckboxChange = (event) => {
    
    var checked = event.target.checked;
    if( this.layer == null)
       this.declareLayer();
    this.props.showLayer(this.layer,checked);
  }

  declareLayer = () => {
   
      this.layer  = new TileLayer({
        visible : true ,       
        source: new TileWMS({
          // url: 'http://localhost:8080/geoserver/Jeru/wms?&LAYERS=Jeru%3Amanti_intersections',
          url : this.props.mdLayer.url,
          params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.0',
            tiled: true,     
            "exceptions": 'application/vnd.ogc.se_inimage'        
          }
        })
      });
      this.layer.set('id',this.props.mdLayer.id);
      this.layer.set('name',this.props.mdLayer.name);
  }
 

  render() {
    const {
      mdLayer
    } = this.props;
    return (
    <div><span></span>
        <fieldset id="layer10">
          <div>            
            <label>
              <input id={this.props.mdLayer.id}
                type="checkbox"  
                onChange = {this.handleCheckboxChange}
           />visibility
              </label>              
          </div>
          <div>
            <label>opacity</label>
            <input type="range" min="0" max="1" step="0.01" />
          </div>
        </fieldset>
      </div>
    );
  }
}

export default LayerListItem;