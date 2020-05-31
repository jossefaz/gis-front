import React, { Component } from "react";
import { connect } from "react-redux";
import { getFocusedMapProxy, getFocusedMap, getCurrentProjection } from '../../../../nessMapping/api';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { Table } from 'semantic-ui-react'
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle"
import "./style.css";
import { Select } from 'semantic-ui-react'

const projectionsOptions = [
    { key: '2039', value: 'EPSG:2039', text: 'רשת ישראל' },
    { key: '4326', value: 'EPSG:4326', text: 'רשת עולמית 84' },
]

class MyCustomWidget extends Component {


    WIDGET_NAME = "Cordinates"

    get focusedMapUUID() {
        return getFocusedMapProxy().uuid.value
    }

    componentDidMount() {
        this.mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:2039',
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
            undefinedHTML: '<p>Pointer not on map !</p>'
        });
        getFocusedMap().addControl(this.mousePositionControl)
    }

    onProjectionChange = (e, v) => {
        this.mousePositionControl.setProjection(v.value);
    }

    onReset = () => {
        // Put here the logic when the user switched map : you could alert the user before switching map to save aany data
    }


    onUnfocus = () => {
        // Put here the logic when the user click on another widget an this one will be unfocused :
        // For example, if you add Interaction to the map, this is the place to remove those interaction in order to let the others 
        // widget to add their own interactions
    }

    onFocus = async () => {
        // Put here the logic when the user click on this widget window :
        // For example, this is the place to add interactions, layers, overlays to the map
    }

    componentWillUnmount() {
        getFocusedMap().removeControl(this.mousePositionControl)
    }

    render() {
        const { Body, Row, Cell } = Table
        return (
            <React.Fragment>
                <Table compact celled selectable className="cTable">
                    <Body>
                        <Row>
                            <Cell>
                                <p>Projection : </p>
                            </Cell>
                            <Cell>
                                <Select placeholder='Choose a projection' options={projectionsOptions} onChange={this.onProjectionChange} />
                            </Cell>
                        </Row>
                        <Row>
                            <Cell>
                                <p>Current poointer coordinates : </p>
                            </Cell>
                            <Cell>
                                <div id="mouse-position"></div>
                            </Cell>
                        </Row>


                    </Body>
                </Table>

            </React.Fragment>

        );
    }

};


export default withWidgetLifeCycle(MyCustomWidget);

