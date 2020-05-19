import React, { useState } from 'react';
import { getOlLayer } from '../../../../../nessMapping/api';
import { Accordion, Icon } from 'semantic-ui-react'
export default (props) => {
    const [active, toggle] = useState(true);
    const renderLegendItem = () => {
        const layer = getOlLayer(props.uuid)
        const name = layer.getSource().getParams().LAYERS.split(':')[1]
        const url = layer.getSource().getLegendUrl()
        return props.global ?
            (
                <React.Fragment>
                    <Accordion>
                        <Accordion.Title
                            active={active}
                            onClick={() => toggle(!active)}
                        >
                            <Icon name="dropdown" />
                            {name}
                        </Accordion.Title>
                        <Accordion.Content active={active}>
                            <img src={url} />
                        </Accordion.Content>
                    </Accordion>

                </React.Fragment>
            ) : <img src={url} />
    }
    return (
        <div>
            {
                renderLegendItem()
            }

        </div>
    )
}
