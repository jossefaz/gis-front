import React, { Component } from 'react';
import { connect } from "react-redux";
import { Slider } from "react-semantic-ui-range";
import config from "react-global-configuration";
import { Button } from "semantic-ui-react";
import { parseString } from 'xml2js'
import { setMapLayerOpacity } from "../../../redux/actions/layers";
import { getOlLayer, getFocusedMap } from "../../../nessMapping/api";
import { getXMLResponse } from '../../../communication/apiManager'
class LayerListDetailsTools extends Component {

    settings = {
        start: 0.7,
        min: 0,
        max: 1,
        step: 0.1,
        onChange: (value) => {
            this.props.setMapLayerOpacity(this.props.layer.uuid, value);
        },
    };
    state = {
        map: null,
        OlLayer: null,
        boundingBox: null
    }

    zoomToLayer = (lyr) => {
        let map = getFocusedMap();
        let OlLayer = getOlLayer(lyr.uuid);

        this.setState({
            map: map,
            OlLayer: OlLayer
        });

        if (this.state.boundingBox)
            this.fitExtent();
        else {
            let url = config.get("geoserverUrl");
            if (url) {
                getXMLResponse(url + "wms?&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities")
                    .then((response) => {
                        let boundingBox;
                        parseString(response, function (err, result) {
                            let layers;
                            layers = result.WMS_Capabilities.Capability[0].Layer[0];
                            let layer = layers.Layer.find((lyr) => lyr.name === OlLayer.name);
                            boundingBox = layer.BoundingBox[1].$;
                        });
                        this.setState({ boundingBox: boundingBox }, this.fitExtent);
                    });
            }
        }
    }

    fitExtent = () => {

        let { boundingBox, map, OlLayer } = this.state;
        if (boundingBox) {
            let res = map.getView().getResolution();
            let maxx = boundingBox.maxx;
            let maxy = boundingBox.maxy;
            let minx = boundingBox.minx;
            let miny = boundingBox.miny;

            OlLayer.setExtent([minx, miny, maxx, maxy]);
            map.getView().fit(OlLayer.getExtent(), { constrainResolution: false });

            let newRes = map.getView().getResolution();
            if (newRes <= 0)
                this.map.getView().setResolution(res);
        }
    }
    render() {
        const { layer } = this.props
        return (
            <React.Fragment>
                <div className="stickingOutText">שקיפות</div>
                <div>באפשרותך לקבוע את השקיפות של השכבה</div>
                <div>
                    <label>שקיפות</label>
                    <Slider color="blue" settings={this.settings} />
                </div>
                <div className="stickingOutText padding">מבט מלא על השכבה</div>
                <div>באפשרותך להתמקד על השכבה אותה בחרת</div>
                <div>
                    <Button id="btnShowFullExtent"
                        onClick={() => this.zoomToLayer(layer)}>הצג</Button>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, {
    setMapLayerOpacity,
})(LayerListDetailsTools);

