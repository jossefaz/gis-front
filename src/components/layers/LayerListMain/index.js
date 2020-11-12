import React from "react";
import LayerList from "../LayerList";
import LayerListMenuItem from "../LayerListMenuItem";
import LayerListMenuItemEx from "../LayerListMenuItemEx";
import LayerListVisible from "../LayerListVisible";

class LayerListMain extends React.Component {

    state = {
        mode: 1
    }

    setMode = (mode, layerId) => {
        this.setState({ mode: mode });
        if (layerId)
            this.setState({ layerId: layerId });
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
                component = <LayerListMenuItemEx
                    layerId={this.state.layerId}
                    setMode={this.setMode}>
                </LayerListMenuItemEx>
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
