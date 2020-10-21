import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';
import LayerListDetailsTools from '../LayerListDetailsTools'
import LegendItem from '../../tool/InternalTool/Legend/LegendItem';
import '../style.css'
class LayerListDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { layer } = this.props;
        const panes = [
            {
                menuItem: 'כלים',
                render: () => <Tab.Pane attached={false}>
                    <LayerListDetailsTools layer={layer}></LayerListDetailsTools>
                </Tab.Pane>,
            },
            {
                menuItem: 'מקרא',
                render: () => <Tab.Pane attached={false}><LegendItem key={layer.uuid} uuid={layer.uuid} global={false}>
                </LegendItem></Tab.Pane>,
            },
            {
                menuItem: 'מאפיינים',
                render: () => <Tab.Pane attached={false}>comming soon</Tab.Pane>,
            }
        ]

        return (
            <React.Fragment>
                <div className="uirtl">
                    <div className="stickingOutText">{layer.name}</div>
                    <div className="padding"> <Icon link
                        onClick={() => this.props.setMode(2)}
                        size='large'
                        name='redo' />
                        חזור לשכבות פעילות
                    </div>
                    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
                </div>
            </React.Fragment>
        );
    }
}

export default LayerListDetails;