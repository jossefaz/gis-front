import React from 'react'
import ColorPicker from '../../ColorPicker'
import { generateNewStyle } from '../../../MeasureDistance/func'
import IconButton from "../../../../../UI/Buttons/IconButton"
export default (props) => {

    const onColorChange = ({ r, g, b, a }) => {
        const feature = props.source.getFeatureById(props.fid)
        feature.setStyle(generateNewStyle(`rgba(${r},${g},${b},${a})`))

    }

    const removeFeature = () => {
        const feature = props.source.getFeatureById(props.fid)
        props.source.removeFeature(feature)
        props.deleteLastFeature(props.fid)
    }

    const FeatureItem = () => {
        return <p key={props.fid}>{props.index + 1}</p>
    }

    const edit = () => {
        props.onOpenEditSession(props.fid)
    }
    return (
        <React.Fragment>
            <FeatureItem />
            <ColorPicker onColorChange={onColorChange} defaultColor={props.defaultColor} />
            <IconButton
                className="ui icon button pointer negative"
                onClick={removeFeature}
                icon="trash-alt" size="lg" />
            <IconButton
                className="ui icon button pointer positive"
                onClick={edit}
                icon="edit" size="lg" />
        </React.Fragment>

    )
}
