import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentLayer } from "../../../../../redux/actions/features";
import { getFocusedMapProxy } from '../../../../../nessMapping/api';
import "./style.css";
class FeatureList extends Component {

    get focusedmap() {
        return getFocusedMapProxy().uuid.value
    }


    sanityCheck = () => {
        const focusedmapInFeatures = this.focusedmap in this.props.Features
        const selectedFeaturesInFeatures = focusedmapInFeatures ? "selectedFeatures" in this.props.Features[this.focusedmap] : false
        return focusedmapInFeatures && selectedFeaturesInFeatures

    }

    renderSelectedFeature = () => {
        return this.sanityCheck() ?
            (
                Object.keys(this.props.Features[this.focusedmap].selectedFeatures).map((layer) => (
                    <tr key={layer}>
                        <td
                            className={
                                this.props.Features[this.focusedmap].currentLayer
                                    ? this.props.Features[this.focusedmap].currentLayer == layer
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

            ) : null


    }

    render() {
        return (
            <React.Fragment>
                <table className="ui table">
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
    return { Features: state.Features, map: state.map.focused };
};

export default connect(mapStateToProps, { setCurrentLayer })(FeatureList);
