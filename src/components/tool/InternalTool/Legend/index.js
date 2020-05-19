import React, { Component } from "react";
import { connect } from "react-redux";
import { getFocusedMapProxy, getNessLayer, getOlLayer, getFocusedMap } from '../../../../nessMapping/api';
import { setInteractions } from '../../../../redux/actions/interaction'
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle"
import LegendItem from './LegendItem'
import "./style.css";

class MyCustomWidget extends Component {

    // Some action of tool reducers need the widget name as a parameter...
    // Its always a good practice to write it only once and access it further by calling this.WIDGET_NAME
    // this avoids typo errors
    WIDGET_NAME = "Legend"

    state = {
        layers: []
    }

    //EXAMPLE of NessMapping API USE
    get focusedMapUUID() {
        return getFocusedMapProxy().uuid.value
        //Now you can access this property by doing : this.focusedMapUUID
    }

    updateLegend = () => {
        if (this.focusedMapUUID in this.props.Layers) {
            const layers = []
            Object.keys(this.props.Layers[this.focusedMapUUID]).map(
                layerUUID => {
                    if (this.props.Layers[this.focusedMapUUID][layerUUID].visible) {
                        layers.push(layerUUID)
                    }


                }
            )
            this.setState({ layers: layers })
        }
    }

    componentDidMount() {
        this.updateLegend();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.layers.length != this.state.layers.length
    }

    componentDidUpdate() {
        this.updateLegend();
    }

    onReset = () => {
        this.updateLegend();
    }

    onFocus = async () => {
        this.updateLegend();
    }

    renderLegend = () => {
        return this.state.layers.map(layer => <LegendItem key={layer} uuid={layer} global={true} />)
    }


    render() {
        return (
            <React.Fragment>
                <div>
                    {
                        this.state.layers.length > 0 ? this.renderLegend() : "No layers added yet"
                    }
                </div>


            </React.Fragment>

        );
    }

};
const mapStateToProps = (state) => {
    return {
        Layers: state.Layers

    };
};



export default connect(mapStateToProps)(
    //Here We call the HOC withWidgetLifeCycle in order to make him taking care of the lifecycle method of a widget (onFocus, onUnfocus, onReaset...etc) that we previously defined
    withWidgetLifeCycle(MyCustomWidget)
);

