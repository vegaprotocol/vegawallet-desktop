import React from "react";

export const SuccessMessage = (props: any): JSX.Element | null => {
    if (props.message === null) {
        return null;
    }
    return (
        <p style={{color: 'green'}}>
            {props.message}
        </p>
    )
}
