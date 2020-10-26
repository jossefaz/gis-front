import React from "react";
import { connect } from "react-redux";
import { selectLayers } from "../../../redux/selectors/layersSelector";
import { Icon, Button } from 'semantic-ui-react';
import { getOlLayer } from "../../../nessMapping/api";
import {
    addLayerToOLMap,
    setMapLayerVisible
} from "../../../redux/actions/layers";
import "../style.css"


class LayerListVisbile extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            layers: {}
        };
    }

    componentDidMount() {
        this.setState({ layers: this.getVisibileLayers() })
    }

    getVisibileLayers = () => {
        let layers = this.props.layers;

        return Object.keys(layers)
            .filter(key => { return layers[key].visible === true })
            .reduce((obj, key) => {
                obj[key] = layers[key];
                return obj;
            }, {});
    }

    setLayerVisibilty = (visiblity, lyr) => {
        var foundLyr = getOlLayer(lyr.uuid);
        if (foundLyr && foundLyr !== -1) {
            let layers = { ...this.state.layers }
            let layer = { ...layers[lyr.uuid] }
            layer.visible = visiblity;
            layers[lyr.uuid] = layer;
            this.setState({ layers: layers });
            this.props.setMapLayerVisible(lyr.uuid, visiblity);
        } else {
            this.props.addLayerToOLMap(lyr.uuid, visiblity);
        }
    };

    render() {
        const { layers } = this.state;
        return (
            <React.Fragment>
                <div className="uirtl">
                    {Object.keys(layers).map((layerId, index) => (
                        <React.Fragment key={index}>
                            <div>
                                <Icon link
                                    onClick={() => this.setLayerVisibilty(layers[layerId].visible ? false : true, layers[layerId])}
                                    size='large'
                                    name={layers[layerId].visible ? 'eye' : 'eye slash'} />
                                <label>{layers[layerId].name}</label>
                                <Icon link
                                    onClick={() => this.props.setMode(3, layers[layerId])}
                                    size='large'
                                    name='angle right' />
                            </div>
                        </React.Fragment>
                    ))}
                    <Button id="btnShowAllLayers"
                        onClick={() => this.props.setMode(1)}>הצג רשימת שכבות</Button>

                </div>
            </React.Fragment>)
    }
}
const mapStateToProps = (state) => {
    return {
        layers: selectLayers(state)
    };
};

export default connect(mapStateToProps, {
    addLayerToOLMap,
    setMapLayerVisible
})(LayerListVisbile);


class LayerVisibleItem extends React.Component {

    render() {
        return (<div></div>);
    }
}

