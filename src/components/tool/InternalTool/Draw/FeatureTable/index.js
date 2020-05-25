import React from 'react'
import FeatureItem from './FeatureItem'

export default (props) => {
    return (
        <div>
            {
                props.features ? props.features.map(feature =>
                    <FeatureItem
                        key={"fi" + feature.getId()}
                        properties={feature.properties}
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
