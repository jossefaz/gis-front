import React from 'react'
import ColorPicker from '../../ColorPicker'
import { generateNewStyle } from '../../../MeasureDistance/func'
export default (props) => {

    const onColorChange = ({ r, g, b, a }) => {
        const feature = props.source.getFeatureById(props.fid)
        feature.setStyle(generateNewStyle(`rgba(${r},${g},${b},${a})`))

    }
    const FeatureItem = () => {
        return props.properties ? props.properties.map(pr => {
            return <p key={pr}>{pr}</p>
        }) : <p key={props.fid}>{props.fid}</p>
    }
    return (
        <React.Fragment>
            <FeatureItem />
            <ColorPicker onColorChange={onColorChange} defaultColor={props.defaultColor} />
        </React.Fragment>

    )
}
