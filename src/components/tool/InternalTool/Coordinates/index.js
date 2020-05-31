import React, { Component } from "react";
import { connect } from "react-redux";
import { getFocusedMapProxy, getFocusedMap, getCurrentProjection, zoomTo } from '../../../../nessMapping/api';
import IconButton from "../../../UI/Buttons/IconButton"
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { convertCoordToIsraelTM } from "../../../../utils/projections";
import { Table, Label, Input, Button, Form } from 'semantic-ui-react'
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle"
import Point from 'ol/geom/Point';
import "./style.css";
import { Select } from 'semantic-ui-react'

const projectionsOptions = [
    { key: '2039', value: 'EPSG:2039', text: 'רשת ישראל' },
    { key: '4326', value: 'EPSG:4326', text: 'רשת עולמית 84' },
    { key: 'GOOGLE', value: 'GOOGLE', text: 'רשת אינטרנט - 3857' },
]

const defaultState = {
    goTo: {
        X: {
            value: null,
            showError: false,
        },
        Y: {
            value: null,
            showError: false
        },
        errorMessage: "נא להזין רק מספרים",
        isValid: false,
    },
    projection: 'EPSG:2039',
    UI: {
        projectionSelect: "רשת קורדינטות : ",
        MousePosition: "קורדינטות העכבר : ",
        goTo: "התמקד : ",
        defaultHTML: '<p>העכבר לא על המפה</p>'

    }
}

class MyCustomWidget extends Component {


    WIDGET_NAME = "Cordinates"

    state = JSON.parse(JSON.stringify(defaultState))



    get focusedMapUUID() {
        return getFocusedMapProxy().uuid.value
    }

    componentDidMount() {
        this.mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:2039',
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
            undefinedHTML: this.state.UI.defaultHTML
        });
        getFocusedMap().addControl(this.mousePositionControl)
    }

    onProjectionChange = (e, v) => {
        this.mousePositionControl.setProjection(v.value);
        this.setState({ projection: v.value, goTo: { ...defaultState.goTo } })
    }

    onCoordinateInput = (e, input) => {
        if (!this.checkInput(input)) {
            this.setState({ goTo: { ...this.state.goTo, [input.name]: { value: null, showError: true } } })
        } else {
            this.setState({ goTo: { ...this.state.goTo, [input.name]: { value: parseFloat(input.value), showError: false } } }, this.checkXY)
        }




    }

    goTo = () => {
        zoomTo(this.getOlPoint())
    }

    getOlPoint = () => {
        const { X, Y } = this.state.goTo
        if (X.value && Y.value) {
            const coord = convertCoordToIsraelTM(this.state.projection, [Y.value, X.value])
            const pointPosition = new Point(coord)
            return pointPosition
        }
        return false
    }

    checkInput = (input) => {
        if (!(parseInt(input.value))) {
            return false
        }
        return true
    }

    checkXY = () => {
        const point = this.getOlPoint()
        let isValid = false
        if (point) {
            const projExtent = getCurrentProjection().getExtent()
            if (point.intersectsExtent(projExtent)) {
                isValid = true
            }
        }
        if (isValid !== this.state.goTo.isValid) {
            this.setState({ goTo: { ...this.state.goTo, isValid } })
        }
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
                <Table compact celled className="cTable">
                    <Body>
                        <Row>
                            <Cell>
                                <p>{this.state.UI.projectionSelect}</p>
                            </Cell>
                            <Cell>
                                <Select value={projectionsOptions.filter(pr => pr.value == this.state.projection)[0].value} placeholder='Choose a projection' options={projectionsOptions} onChange={this.onProjectionChange} />
                            </Cell>
                        </Row>
                        <Row>
                            <Cell>
                                <p>{this.state.UI.MousePosition}</p>
                            </Cell>
                            <Cell>
                                <div id="mouse-position"></div>
                            </Cell>
                        </Row>
                        <Row>
                            <Cell>
                                <p>{this.state.UI.goTo}</p>
                            </Cell>
                            <Cell>
                                <div onMouseDownCapture={e => e.stopPropagation()}>
                                    <Form>
                                        <Form.Field
                                            id='form-input-control-X'
                                            control={Input}
                                            placeholder='X'
                                            name='X'
                                            value={this.state.goTo.X.value || ''}
                                            onChange={this.onCoordinateInput}
                                            error={this.state.goTo.X.showError && {
                                                content: this.state.goTo.errorMessage,
                                            }}
                                        />
                                        <Form.Field
                                            id='form-input-control-Y'
                                            control={Input}
                                            placeholder='Y'
                                            value={this.state.goTo.Y.value || ''}
                                            name='Y'
                                            onChange={this.onCoordinateInput}
                                            error={this.state.goTo.Y.showError && {
                                                content: this.state.goTo.errorMessage,
                                            }}
                                        />
                                        {
                                            this.state.goTo.X.value && this.state.goTo.Y.value && !this.state.goTo.isValid &&
                                            <p>Coordinates are valid numbers but won't fall inside Israel Grid, pleace enter a valid coordinate</p>
                                        }
                                        <IconButton
                                            className="ui icon button pointer positive"
                                            onClick={this.goTo}
                                            disabled={!(this.state.goTo.X && this.state.goTo.Y && this.state.goTo.isValid)}
                                            icon='crosshairs' size="lg" />
                                    </Form>
                                </div>



                            </Cell>
                        </Row>


                    </Body>
                </Table>

            </React.Fragment>

        );
    }

};


export default withWidgetLifeCycle(MyCustomWidget);

