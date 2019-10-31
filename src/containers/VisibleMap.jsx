import React from 'react';
import { connect } from 'react-redux';
import MapComponent from '../components/map/MapComponent';


class VisibleMap extends React.Component {
    constructor(props) {
        super(props)

        this.map = {};
    }

    render() {
        return (
           <MapComponent layers={this.props.layers}></MapComponent>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        layers: state.layers
    }    
}

export default connect(
    mapStateToProps,
    null,
)(VisibleMap);