import React, { useState } from 'react';
import { getOlLayer, getFocusedMap, getCurrentResolution, getCurrentExtent } from '../../../../../nessMapping/api';
import { Accordion, Icon } from 'semantic-ui-react'
export default (props) => {
    const [active, toggle] = useState(true);
    const [resolution, setResolution] = useState()

    getFocusedMap().getView().on('change:resolution', function (event) {
        setResolution(getCurrentResolution());
    });
    getFocusedMap().on('moveend', () => setResolution(getCurrentResolution()));
    const renderLegendItem = () => {
        const layer = getOlLayer(props.uuid)
        const name = layer.getSource().getParams().LAYERS.split(':')[1]
        const baseurl = layer.getSource().getLegendUrl()
        const cql = `&CQL_FILTER=BBOX(geom, ${getCurrentExtent().join(',')} )`
        const url = `${baseurl}${cql}&legend_options=countMatched:true;hideEmptyRules:true&forceLabels=true`
        console.log(url)
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
