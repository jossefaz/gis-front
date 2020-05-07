import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default (props) => {
    return (
        <button
            className={props.className}
            onClick={props.onClick}
            disabled={props.disabled}
            style={{
                margin: "0.5em"
            }}
        >
            <FontAwesomeIcon icon={props.icon} size={props.size} />
        </button>
    )
}
