import React, { useState } from 'react'
import TextItem from './TextItem'
import { Table } from 'semantic-ui-react'
import { Accordion, Icon } from 'semantic-ui-react'
import './style.css'

export default (props) => {
    const { Header, Body, Row, HeaderCell } = Table
    const [active, toggle] = useState(true);

    const onRowOver = (overlay) => {
        console.log(overlay)
        // if (!OveredFeature) {
        //     serOveredFeature(feature)
        // }
        // highlightFeature(feature.getGeometry())
    }

    return (

        <React.Fragment>
            <Accordion>
                <Accordion.Title
                    active={active}
                    onClick={() => toggle(!active)}
                >
                    <Icon name="dropdown" />
                    "טקסטים"
                </Accordion.Title>
                <Accordion.Content active={active}>
                    <Table compact celled selectable className="cTable">
                        <Header>
                            <Row>
                                <HeaderCell>מס'</HeaderCell>
                                <HeaderCell>טקסט</HeaderCell>
                                <HeaderCell>שליטה</HeaderCell>
                            </Row>
                        </Header>

                        <Body>
                            {
                                props.overlays ? Object.keys(props.overlays).map((overlay, index) =>
                                    <Row key={overlay}
                                        onMouseOver={(e) => onRowOver(overlay)}
                                        onMouseLeave={() => { }}
                                    >
                                        <TextItem index={index} id={overlay} content={props.overlays[overlay].content} editText={props.editText} />
                                    </Row>
                                ) : null
                            }
                        </Body>
                    </Table>
                </Accordion.Content>
            </Accordion>

        </React.Fragment>



    )
}
