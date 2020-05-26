import React from "react";
import { connect } from "react-redux";
import withWidgetLifeCycle from "../../../HOC/withWidgetLifeCycle"
import { getInteraction, getInteractionGraphicLayer, getInteractionVectorSource, getFocusedMap } from '../../../../nessMapping/api'
import { setInteraction, unsetInteraction, unsetInteractions } from "../../../../redux/actions/interaction";
import { setOverlay, unsetOverlays, unsetOverlay } from "../../../../redux/actions/overlay";
import IconButton from "../../../UI/Buttons/IconButton"
import { unsetUnfocused } from "../../../../redux/actions/tools";
import { generateNewStyle } from "../MeasureDistance/func";
import generateID from '../../../../utils/uuid'
import { escapeHandler } from '../../../../utils/eventHandlers'
import { Confirm, Label } from 'semantic-ui-react'
import FeatureTable from './FeatureTable'
import ColorPicker from './ColorPicker'
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
        lastFeature: null,
        drawCount: 0,
        defaultColor: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
        },


    }

    get map() {
        return this.props.maps.focused
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
        this.setState({ open: false, drawn: false, lastFeature: null })
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

    onDrawEnd = () => {
        const draw = getInteraction(this.draw)
        if (draw) {
            draw.on('drawend',
                (e) => {
                    const { r, g, b, a } = this.state.defaultColor
                    e.feature.setStyle(generateNewStyle(`rgba(${r},${g},${b},${a})`))
                    e.feature.setId(generateID())
                    this.setState({ drawn: true, lastFeature: e.feature })

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
    }
    componentDidUpdate() {
        document.addEventListener("keydown", (e) => escapeHandler(e, this.abortDrawing));
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", (e) => escapeHandler(e, this.abortDrawing));
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

    onColorChange = color => this.setState({ defaultColor: color })

    onUnfocus = () => {
        this.onReset()
    }

    deleteLastFeature = (id) => {
        if (this.state.lastFeature && id == this.state.lastFeature.getId()) {
            this.setState({ lastFeature: null })
        }
    }

    getDrawnFeatures = () => {
        if (this.state.lastFeature) {
            const lastFeatureId = this.state.lastFeature.getId()
            const filteredFeatures = this.DrawSource.getFeatures().filter(f => f.getId() !== lastFeatureId)
            return [...filteredFeatures, this.state.lastFeature]
        }
        return this.DrawSource ? this.DrawSource.getFeatures() : []
    }

    render() {
        const features = this.getDrawnFeatures()
        const disable = features.length == 0
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



                    </Grid.Row>
                    <Grid.Row>
                        <label className="labels">בחר צבע : </label>
                        <ColorPicker onColorChange={this.onColorChange} defaultColor={this.state.defaultColor} />
                    </Grid.Row>





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


            </React.Fragment>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        Features: state.Features,
        maps: state.map,
        Interactions: state.Interactions,
    };
};

const mapDispatchToProps = { setInteraction, unsetInteraction, unsetInteractions, setOverlay, unsetOverlays, unsetOverlay, unsetUnfocused }

export default connect(mapStateToProps, mapDispatchToProps)(withWidgetLifeCycle(Draw));