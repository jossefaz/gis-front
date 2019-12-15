import React from "react";
import { connect } from "react-redux";
import  {addLayer}  from "../../redux/actions/actions";
import {Vector as VectorSource} from 'ol/source.js';
import {Projection} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Vector as VectorLayer} from 'ol/layer.js';

class AddTodo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
  }

  updateInput = input => {
    this.setState({ input });
  };

  handleAddTodo = () => {

    var proj_2039 = new Projection({
      code: 'EPSG:2039',
      units: 'm',
      axisOrientation: 'neu',
      global: false
    });

    var polyEditingVectorSource = new VectorSource({
      format: new GeoJSON(),
      url:'http://localhost:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3AGANANUTFORGEOSERVER&maxFeatures=100000&outputFormat=application%2Fjson'
    });

    var vectorEditingLayer = new VectorLayer({
      source: polyEditingVectorSource,
      projection: proj_2039 
    });

    this.props.addLayer(vectorEditingLayer);    
  };

  render() {
    return (
      <div>       
        <button className="add-todo" onClick={this.handleAddTodo}>
          Add Todo
        </button>
      </div>
    );
  }
}

export default connect(
  null,
  { addLayer }
)(AddTodo);

