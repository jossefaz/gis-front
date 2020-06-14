import React from "react";
import { connect } from "react-redux";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle"
import { getInteraction, getInteractionGraphicLayer, getInteractionVectorSource, getFocusedMap, getOverlay } from '../../../../nessMapping/api'
import { setInteraction, unsetInteraction, unsetInteractions } from "../../../../redux/actions/interaction";
import { setOverlay, unsetOverlays, unsetOverlay, setOverlayProperty } from "../../../../redux/actions/overlay";
import IconButton from "../../../UI/Buttons/IconButton"
import { unsetUnfocused } from "../../../../redux/actions/tools";
import { generateNewStyle } from "../MeasureDistance/func";
import generateID from '../../../../utils/uuid'
import { escapeHandler } from '../../../../utils/eventHandlers'
import { getWKTFromOlGeom } from '../../../../utils/geometryToWkt'
import TextForm from './Texts/TextForm'
import { Confirm, Label } from 'semantic-ui-react'
import FeatureTable from './FeatureTable'
import TextTable from './Texts'
import ColorPicker from './ColorPicker'
import { DragPan } from "ol/interaction";
import { Grid } from 'semantic-ui-react'
import Collection from 'ol/Collection';
import Point from 'ol/geom/Point';
import "./style.css";
class Draw extends React.Component {

    WIDGET_NAME = "Draw"
    INTERACTIONS = {
        Draw: "Draw",
        Select: "Select",
        Modify: "Modify"
    }
    CLASSNAMES = {
        TEXT: 'ol-tooltip ol-tooltip-measure',
        HIDDEN: 'hidden',
        FINISH: 'ol-tooltip ol-tooltip-static'
    }
    state = {
        eraseDraw: {
            openAlert: false,
            content: "? האם ברצונך למחוק את כלל המדידות שביצת",
            confirmBtn: "כן",
            cancelBtn: "לא"
        },
        editSession: false,
        view: true,
        drawn: false,
        lastFeature: {},
        drawCount: 0,
        defaultColor: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
        },
        sessionType: "Geometry",
        editText: {
            text: null,
            overlayID: null
        }


    }


    get selfOverlay() {
        if (this.WIDGET_NAME in this.props.Overlays && this.map in this.props.Overlays[this.WIDGET_NAME]) {
            return this.props.Overlays[this.WIDGET_NAME][this.map]
        }
        return false
    }

    get map() {
        return this.props.maps.focused
    }

    get lastFeature() {
        return this.map in this.state.lastFeature ? this.state.lastFeature[this.map] : false
    }

    get selfInteraction() {
        if (this.WIDGET_NAME in this.props.Interactions && this.map in this.props.Interactions[this.WIDGET_NAME]) {
            return this.props.Interactions[this.WIDGET_NAME][this.map]
        }
        return false
    }

    get draw() {
        return this.getSelfInteraction(this.INTERACTIONS.Draw)
    }

    get select() {
        return this.getSelfInteraction(this.INTERACTIONS.Select)
    }

    get modify() {
        return this.getSelfInteraction(this.INTERACTIONS.Modify)
    }
    getSelfInteraction = (interaction) => {
        if (this.selfInteraction && interaction in this.selfInteraction) {
            return this.selfInteraction[interaction].uuid
        }
        return false
    }

    get DrawLayer() {
        return this.draw ? getInteractionGraphicLayer(this.draw) : null
    }

    get DrawSource() {
        return this.draw ? getInteractionVectorSource(this.draw) : null
    }


    toogleView = () => {
        if (this.DrawLayer) {
            this.DrawLayer.setVisible(!this.state.view)
        }
        this.setState({
            view: !this.state.view
        })
    }



    addInteraction = async (drawtype) => {
        const sourceLayer = this.DrawSource // save it before it will be deleted !!
        const Layer = this.DrawLayer
        this.removeDrawObject();
        await this.props.setInteraction({
            Type: "Draw",
            drawConfig: { type: drawtype },
            sourceLayer,
            Layer,
            widgetName: this.WIDGET_NAME
        });
    }

    onOpenDrawSession = async (drawtype) => {
        await this.addInteraction(drawtype)
        this.setState({ sessionType: "Geometry" })
        this.onDrawEnd()
    }

    onOpenEditSession = async (featureID) => {
        this.removeSelectAndEdit()
        this.removeDrawObject()
        const feature = featureID ? this.DrawSource.getFeatureById(featureID) : null
        await this.props.setInteraction({
            Type: this.INTERACTIONS.Select,
            interactionConfig: {
                wrapX: false,
                layers: [this.DrawLayer],
                ...(feature) && { features: new Collection([feature]) }
            },
            widgetName: this.WIDGET_NAME
        });
        await this.props.setInteraction({
            Type: this.INTERACTIONS.Modify,
            interactionConfig: {
                features: getInteraction(this.select).getFeatures()
            },
            widgetName: this.WIDGET_NAME
        });
        this.setState({ editSession: { status: true, current: feature.getId() } })
    }

    autoClosingEditSession = (e) => {
        if (this.select) {
            const pointPosition = new Point(e.coordinate)
            let close = true
            getInteraction(this.select).getFeatures().getArray().map(
                feature => {
                    if (pointPosition.intersectsExtent(feature.getGeometry().getExtent())) {
                        close = false
                    }

                }
            )
            if (close) {
                this.setState({ editSession: { status: false, current: null } })
                this.removeSelectAndEdit()
            }


        }
    }





    onClearDrawing = () => {
        this.DrawSource.clear()
        this.setState({ open: false, drawn: false, lastFeature: { ...this.state.lastFeature, [this.map]: null } })
        this.removeDrawObject()
    }
    removeDrawObject = () => {
        if (this.draw) {
            this.props.unsetInteraction({ uuid: this.selfInteraction[this.INTERACTIONS.Draw].uuid, widgetName: this.WIDGET_NAME, Type: this.INTERACTIONS.Draw })
        }

    }

    removeSelectAndEdit = async () => {
        if (this.select && this.modify) {
            const { Select, Modify } = this.INTERACTIONS
            await this.props.unsetInteractions([
                {
                    uuid: this.select, widgetName: this.WIDGET_NAME, Type: Select
                },
                {
                    uuid: this.modify, widgetName: this.WIDGET_NAME, Type: Modify
                }

            ]
            )
        }
    }

    removeOverlay = (uuid) => {
        if (uuid == this.state.editText.overlayID) {
            this.setState({
                editText: { ...this.state.editText, overlayID: null },
                sessionType: ''
            })

        }
        this.props.unsetOverlay({ uuid, widgetName: this.WIDGET_NAME })
    }

    onDrawEnd = () => {
        const draw = getInteraction(this.draw)
        if (draw) {
            draw.on('drawend',
                (e) => {
                    const { r, g, b, a } = this.state.defaultColor
                    e.feature.setStyle(generateNewStyle(`rgba(${r},${g},${b},${a})`))
                    e.feature.setId(generateID())
                    console.log(getWKTFromOlGeom(e.feature))
                    this.setState({ drawn: true, lastFeature: { ...this.state.lastFeature, [this.map]: e.feature } })

                });

        }
    }

    abortDrawing = () => {
        if (this.draw) {
            getInteraction(this.draw).abortDrawing();
        }
    }
    // LIFECYCLE
    componentDidMount() {
        getFocusedMap().on('pointerdown', this.autoClosingEditSession);
        getFocusedMap().on('pointermove', this.dragOverlay);
        getFocusedMap().on('pointerup', this.unDragOverlay);
        getFocusedMap().getInteractions().forEach((interaction) => {
            if (interaction instanceof DragPan) {
                this.dragPan = interaction;
            }
        });
    }
    componentDidUpdate() {
        document.addEventListener("keydown", (e) => escapeHandler(e, this.abortDrawing));
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", (e) => escapeHandler(e, this.abortDrawing));
        getFocusedMap().un('pointerdown', this.autoClosingEditSession);
        getFocusedMap().un('pointermove', this.dragOverlay);
        getFocusedMap().un('pointerup', this.unDragOverlay);
        this.onReset();
    }
    onReset = () => {
        this.abortDrawing();
        this.removeAllInteractions()
    }

    removeAllInteractions = async () => {
        if (this.selfInteraction) {
            const InteractionArray = []
            Object.keys(this.selfInteraction).map(InteractionName => {
                const { uuid, Type } = this.selfInteraction[InteractionName]
                InteractionArray.push({ uuid, widgetName: this.WIDGET_NAME, Type })
            })
            if (InteractionArray.length > 0) {
                await this.props.unsetInteractions(InteractionArray);
            }
        }

    }


    createNewText = async (text) => {
        const selector = `${this.WIDGET_NAME}${this.map}`
        await this.props.setOverlay({
            overlay: {
                element: this.generateOverlayDiv(selector, text),
                offset: [0, -15],
                positioning: 'bottom-center',
                stopEvent: false,
                dragging: false
            },
            widgetName: this.WIDGET_NAME,
            content: text,
            selector
        }
        );
        if (this.selfOverlay) {
            const currentOverlays = Object.keys(this.selfOverlay.overlays)
            const lastID = currentOverlays[currentOverlays.length - 1]
            const overlay = getOverlay(lastID)
            overlay.setPosition(getFocusedMap().getView().getCenter())
            this.addDraggableToOverlay(lastID)
        }
        this.setState({
            sessionType: "",
            editText: {
                text: '',
                overlayID: null
            }
        })
    }

    createOrEditText = async (text, textID) => {
        if (textID) {
            const overlay = this.selfOverlay.overlays[textID]
            const overlayDiv = document.querySelector(`#${overlay.selector}`)
            this.props.setOverlayProperty({
                widgetName: this.WIDGET_NAME,
                uuid: textID,
                property: 'content',
                value: text
            })
            overlayDiv.innerHTML = text
            this.setState({
                sessionType: "",
                editText: {
                    text: '',
                    overlayID: null
                }
            })
        } else {
            await this.createNewText(text)
        }
    }

    generateOverlayDiv(selector, innerHtml) {
        const overlayDiv = document.createElement("div")
        overlayDiv.setAttribute("id", selector)
        overlayDiv.setAttribute("class", this.CLASSNAMES.TEXT)
        overlayDiv.innerHTML = innerHtml
        return overlayDiv;
    }

    dragOverlay = (evt) => {
        if (this.selfOverlay) {
            Object.keys(this.selfOverlay.overlays).map(ol => {
                const overlay = getOverlay(ol)
                if (overlay.get('dragging')) {
                    this.dragPan.setActive(false);
                    overlay.setPosition(evt.coordinate)
                }
            })
        }
    }

    unDragOverlay = (evt) => {
        if (this.selfOverlay) {
            Object.keys(this.selfOverlay.overlays).map(ol => {
                if (getOverlay(ol).get('dragging')) {
                    this.dragPan.setActive(true);
                    getOverlay(ol).set('dragging', false);
                }
            })
        }
    }

    editText = (text, overlayID) => {
        this.setState({
            sessionType: "Text",
            editText: {
                text,
                overlayID
            },
        })

    }

    cancelEditText = () => {
        this.setState({
            sessionType: "",
            editText: {
                text: '',
                overlayID: null
            }
        })
    }

    addDraggableToOverlay = (id) => {
        const overlay = this.selfOverlay.overlays[id]
        const overlayDiv = document.getElementById(overlay.selector)
        const widgetName = this.WIDGET_NAME
        overlayDiv.setAttribute("uuid", id)
        overlayDiv.setAttribute("dragging", false)
        overlayDiv.addEventListener('mousedown', function (evt) {
            getOverlay(this.id.split(widgetName)[1]).set('dragging', true)
            console.info('start dragging');
        });;

    }


    onColorChange = color => this.setState({ defaultColor: color })

    onUnfocus = () => {
        this.onReset()
    }

    deleteLastFeature = (id) => {
        if (this.lastFeature && id == this.lastFeature.getId()) {
            this.setState({ lastFeature: { ...this.state.lastFeature, [this.map]: null } })
        }
    }


    getDrawnFeatures = () => {
        if (this.lastFeature) {
            const lastFeatureId = this.lastFeature.getId()
            const filteredFeatures = this.DrawSource.getFeatures().filter(f => f.getId() !== lastFeatureId)
            return [...filteredFeatures, this.lastFeature]
        }
        return this.DrawSource ? this.DrawSource.getFeatures() : []
    }

    handleTextChange = (text) => {
        this.setState({
            editText: { ...this.state.editText, text }
        })
    }




    render() {
        const features = this.getDrawnFeatures()
        const disable = features.length == 0
        const overlays = this.selfOverlay
        return (
            <React.Fragment>
                <Grid columns='equal' stackable divided='vertically' className="widhtEm">
                    <Grid.Row>
                        <label className="labels">בחר צורה : </label>

                        <IconButton
                            className="ui icon button primary pointer"
                            onClick={() => this.onOpenDrawSession("Polygon")}
                            icon="draw-polygon" size="lg" />
                        <IconButton
                            className="ui icon button primary pointer"
                            onClick={() => this.onOpenDrawSession("LineString")}
                            icon="grip-lines" size="lg" />

                        <IconButton
                            className="ui icon button primary pointer"
                            onClick={() => this.onOpenDrawSession("Circle")}
                            icon="circle" size="lg" />

                        <IconButton
                            className="ui icon button primary pointer"
                            onClick={() => this.setState({
                                sessionType: "Text", editText: {
                                    text: null,
                                    overlayID: null,
                                }
                            })}
                            icon="font" size="lg" />



                    </Grid.Row>
                    {
                        this.state.sessionType == "Text" &&
                        < Grid.Row >
                            <TextForm
                                cancelEdit={this.cancelEditText}
                                onSubmit={this.createOrEditText}
                                value={this.state.editText.text}
                                setValue={this.handleTextChange}
                                overlayID={this.state.editText.overlayID} />
                        </Grid.Row>
                    }
                    {
                        this.state.sessionType == "Geometry" &&
                        < Grid.Row >
                            <label className="labels">בחר צבע : </label>
                            <ColorPicker onColorChange={this.onColorChange} defaultColor={this.state.defaultColor} />
                        </Grid.Row>
                    }





                    {
                        !disable &&
                        <React.Fragment>

                            <Grid.Row>
                                <label className="labels">שליטה כללית : </label>
                                <IconButton
                                    className={`ui icon button pointer ${!disable ? 'negative' : 'disabled'}`}
                                    onClick={() => this.setState({ open: true })}
                                    disabled={disable}
                                    icon="trash-alt" size="lg" />
                                <IconButton
                                    className={`ui icon button pointer ${!disable ? 'positive' : 'disabled'}`}
                                    onClick={() => this.toogleView()}
                                    disabled={disable}
                                    icon={this.state.view ? 'eye' : 'eye-slash'} size="lg" />
                            </Grid.Row>
                            <Grid.Row>

                                <FeatureTable
                                    features={features}
                                    source={this.DrawSource}
                                    defaultColor={this.state.defaultColor}
                                    deleteLastFeature={this.deleteLastFeature}
                                    onOpenEditSession={this.onOpenEditSession}
                                    editSession={this.state.editSession}
                                /></Grid.Row>
                        </React.Fragment>
                    }
                    {
                        overlays &&
                        <React.Fragment>
                            <Grid.Row>
                                <TextTable
                                    overlays={this.selfOverlay.overlays}
                                    editText={this.editText}
                                    removeOverlay={this.removeOverlay}
                                />
                            </Grid.Row>
                        </React.Fragment>
                    }
                </Grid>
                <Confirm
                    open={this.state.open}
                    size='mini'
                    content={this.state.eraseDraw.content}
                    cancelButton={this.state.eraseDraw.cancelBtn}
                    confirmButton={this.state.eraseDraw.confirmBtn}
                    onCancel={() => this.setState({ ...this.state.eraseDraw, open: false })}
                    onConfirm={this.onClearDrawing}
                />


            </React.Fragment >
        );
    }
}



const mapStateToProps = (state) => {
    return {
        Features: state.Features,
        maps: state.map,
        Interactions: state.Interactions,
        Overlays: state.Overlays
    };
};

const mapDispatchToProps = { setInteraction, unsetInteraction, unsetInteractions, setOverlay, unsetOverlays, unsetOverlay, unsetUnfocused, setOverlayProperty }

export default connect(mapStateToProps, mapDispatchToProps)(withWidgetLifeCycle(Draw));