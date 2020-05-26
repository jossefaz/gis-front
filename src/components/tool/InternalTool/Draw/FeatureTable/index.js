import React, { useState } from 'react'
import FeatureItem from './FeatureItem'
import { Table } from 'semantic-ui-react'
import { highlightFeature, unhighlightFeature } from '../../../../../nessMapping/api'
import './style.css'

export default (props) => {
    const { Header, Body, Row, HeaderCell } = Table
    const [OveredFeature, serOveredFeature] = useState(null)

    const onRowOver = (feature) => {
        if (!OveredFeature) {
            serOveredFeature(feature)
        }
        highlightFeature(feature.getGeometry())
    }

    return (

        <Table compact celled selectable className="cTable">
            <Header>
                <Row>
                    <HeaderCell>מס'</HeaderCell>
                    <HeaderCell>סגנון</HeaderCell>
                    <HeaderCell>שליטה</HeaderCell>


                </Row>
            </Header>

            <Body>
                {
                    props.features ? props.features.map((feature, index) =>
                        <Row key={"fi" + feature.getId()}
                            onMouseOver={(e) => onRowOver(feature)}
                            onMouseLeave={() => unhighlightFeature()}
                        >
                            <FeatureItem
                                index={index}
                                fid={feature.getId()}
                                source={props.source}
                                defaultColor={props.defaultColor}
                                deleteLastFeature={props.deleteLastFeature}
                                onOpenEditSession={props.onOpenEditSession}
                                editSession={props.editSession}
                            />
                        </Row>
                    ) : null
                }
            </Body>
        </Table>

    )
}
