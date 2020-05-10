import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default (props) => {
    return (
        <button
            className={props.className}
            onClick={props.onClick}
            disabled={props.disabled}
            onMouseOver={props.onHover}
            style={{
                margin: "0.1em"
            }}
        >
            <FontAwesomeIcon icon={props.icon} size={props.size} />
        </button>
    )
}
