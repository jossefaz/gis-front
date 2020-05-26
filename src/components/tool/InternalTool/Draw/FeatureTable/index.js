import React from 'react'
import FeatureItem from './FeatureItem'
import { Table } from 'semantic-ui-react'

export default (props) => {
    const { Header, Body, Row, HeaderCell } = Table
    return (

        <Table compact celled selectable>
            <Header>
                <Row>
                    <HeaderCell>Controls</HeaderCell>
                    <HeaderCell>Color</HeaderCell>
                    <HeaderCell>Id</HeaderCell>
                </Row>
            </Header>

            <Body>
                {
                    props.features ? props.features.map((feature, index) =>
                        <Row key={"fi" + feature.getId()}>
                            <FeatureItem
                                index={index}
                                fid={feature.getId()}
                                source={props.source}
                                defaultColor={props.defaultColor}
                                deleteLastFeature={props.deleteLastFeature}
                                onOpenEditSession={props.onOpenEditSession}
                            />
                        </Row>
                    ) : null
                }
            </Body>
        </Table>

    )
}
