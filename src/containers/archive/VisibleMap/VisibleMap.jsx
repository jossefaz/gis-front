import React from 'react';
import { connect } from 'react-redux';
import MapComponent from '../../components/Map';
import { addLayer, } from "../../../redux/actions/actions";
import { selectUnits } from "../../../redux/selectors/mantiSystemsSelector";

import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';



const styleFunction = function (feature, resolution) {
    var styleOL = new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({
                color: 'green'
            })
        })
    });
    var styleCPS = new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({
                color: 'blue'
            })
        })
    });

    var styleOFFL = new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({
                color: 'black'
            })
        })
    });

    var styleFAIL = new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({
                color: 'red'
            })
        })
    });

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

    render() {

        return (
            <MapComponent layers={this.props.layers}
                addLayer={this.props.addLayer}
                updatePublishedStatus={this.props.updatePublishedStatus}
                units={this.props.units}></MapComponent>
        )
    }
}

const mapStateToProps = state => {
    return {
        layers: state.mapLayers.layers,
        units: selectUnits(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // dispatching actions returned by action creators
        addLayer: (layer) => dispatch(addLayer(layer))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null
)(VisibleMap);


