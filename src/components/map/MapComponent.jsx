import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


// Open Layers Imports
import {ol} from '././ol';
import 'ol/ol.css';


class MapComponent extends React.Component {
    constructor(props) {
        super(props)

        this.map = {};
    }


    componentDidMount() {

        this.map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: 'map',
            view: new ol.View({
                center: [0, 0],
                zoom: 2
            })
        });

        // this.map.updateSize();
        // this.map.render();
        // this.map.redraw();
    }


    render() {
        //if(this.props.contentRender) {      // Conditional Rendering
        return (
            <div>
         


                    <div id="map" className="map" ref="olmap"></div>


         
            </div>
        )
        //}else{return false}
    }
}



MapComponent.propTypes = {
    contentRender: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        contentRender: state.setWMSComponentStatus.setWMSComponentStatusState
    }
}

export default connect(mapStateToProps)(MapComponent);