import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentLayer } from "../../../../../redux/actions/features";
import "./style.css";
class FeatureList extends Component {


    renderSelectedFeature = () => {

        if (Object.keys(this.props.SelectedLayers).length > 0) {
            return Object.keys(this.props.SelectedLayers).map((layer) => (
                <div className="item" key={layer}>
                    <div
                        className="content pointerCur"
                        onClick={() => this.props.setCurrentLayer(layer)}
                    >
                        <p
                            className={
                                this.props.currentLayer
                                    ? this.props.currentLayer == layer
                                        ? "currentLayer"
                                        : ""
                                    : ""
                            }
                        >
                            {layer}
                        </p>
                    </div>
                </div>
            ))
        }
    }

    render() {
        return (
            <div className="ui divided list">{this.renderSelectedFeature()}</div>
        );
    }
}

const mapStateToProps = (state) => {
    return { SelectedLayers: state.Features.selectedFeatures, currentLayer: state.Features.currentLayer };
};

export default connect(mapStateToProps, { setCurrentLayer })(FeatureList);
