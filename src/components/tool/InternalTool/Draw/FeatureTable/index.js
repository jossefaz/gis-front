import React from 'react'

export default (props) => {
    console.log(props.features)
    return (
        <div>
            {
                props.features ? props.features.map(p => {
                    return p.properties ? p.properties.map(pr => {
                        return <p>{p}</p>
                    }) : p.ol_uid

                }) : null
            }
        </div>
    )
}
