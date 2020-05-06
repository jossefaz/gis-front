import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentLayer } from "../../../../../redux/actions/features";
import "./style.css";
class FeatureList extends Component {


    renderSelectedFeature = () => {

        if (Object.keys(this.props.SelectedLayers).length > 0) {
            return Object.keys(this.props.SelectedLayers).map((layer) => (
                <tr key={layer}>
                    <td
                        className={
                            this.props.currentLayer
                                ? this.props.currentLayer == layer
                                    ? "currentLayer pointerCur"
                                    : "pointerCur"
                                : "pointerCur"
                        }
                        onClick={() => this.props.setCurrentLayer(layer)}
                    >
                        {layer}
                    </td>
                </tr>
            ))
        }
    }

    render() {
        return (
            <React.Fragment>
                <table class="ui table">
                    <thead>
                        <tr>
                            <th>Layers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderSelectedFeature()}
                    </tbody>
                </table>

            </React.Fragment>

        );
    }
}

const mapStateToProps = (state) => {
    return { SelectedLayers: state.Features.selectedFeatures, currentLayer: state.Features.currentLayer };
};

export default connect(mapStateToProps, { setCurrentLayer })(FeatureList);
