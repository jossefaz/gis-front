import React from 'react'
import FeatureItem from './FeatureItem'
import { Table } from 'semantic-ui-react'
import './style.css'

export default (props) => {
    const { Header, Body, Row, HeaderCell } = Table
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
                        <Row key={"fi" + feature.getId()} onClick={() => console.log(feature)}>
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
