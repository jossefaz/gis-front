import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentLayer } from "../../../../../redux/actions/features";
import "./style.css";
class FeatureList extends Component {

    focusedmap = this.props.focusedmap

    sanityCheck = () => {
        return this.focusedmap in this.props.Features &&
            "selectedFeatures" in this.props.Features[this.focusedmap] &&
            Object.keys(this.props.Features[this.focusedmap].selectedFeatures).length > 0
    }

    renderSelectedFeature = () => {
        return this.sanityCheck ?
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
    return { Features: state.Features };
};

export default connect(mapStateToProps, { setCurrentLayer })(FeatureList);
