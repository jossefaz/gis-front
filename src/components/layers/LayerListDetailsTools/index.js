import React, { Component } from 'react';
import { connect } from "react-redux";
import { Slider } from "react-semantic-ui-range";
import {
    setMapLayerOpacity,
} from "../../../redux/actions/layers";
class LayerListDetailsTools extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    settings = {
        start: 0.7,
        min: 0,
        max: 1,
        step: 0.1,
        onChange: (value) => {
            this.props.setMapLayerOpacity(this.props.layer.uuid, value);
        },
    };



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

                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, {
    setMapLayerOpacity,
})(LayerListDetailsTools);

