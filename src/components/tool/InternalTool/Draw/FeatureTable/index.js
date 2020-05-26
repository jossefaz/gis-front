import React from 'react'
import FeatureItem from './FeatureItem'

export default (props) => {
    return (
        <div>
            {
                props.features ? props.features.map((feature, index) =>
                    <FeatureItem
                        key={"fi" + feature.getId()}
                        index={index}
                        fid={feature.getId()}
                        source={props.source}
                        defaultColor={props.defaultColor}
                        deleteLastFeature={props.deleteLastFeature}
                        onOpenEditSession={props.onOpenEditSession}
                    />) : null
            }
        </div>
    )
}
