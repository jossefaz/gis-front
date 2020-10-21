import React from "react";
import LayerList from "../LayerList/LayerList";
import LayerListDetails from "../LayerListDetails";
import LayerListVisible from "../LayerListVisible";

class LayerListMain extends React.Component {

    constructor(props) {
        super(props)
        this.state = { mode: 1 }
    }

    setMode = (mode, layer) => {
        this.setState({ mode: mode });
        if (layer)
            this.setState({ layer: layer });
    }

    switchLayerListComponents = () => {
        let component;
        switch (this.state.mode) {
            case 1:
                component = <LayerList setMode={this.setMode}></LayerList>
                break;
            case 2:
                component = <LayerListVisible setMode={this.setMode}></LayerListVisible>
                break;
            case 3:
                component = <LayerListDetails
                    layer={this.state.layer}
                    setMode={this.setMode}></LayerListDetails>
                break;
            default:
                break;
        }
        return component;
    }

    render() {
        return (
            <div>{this.switchLayerListComponents()}</div>
        );
    }
}

export default LayerListMain
