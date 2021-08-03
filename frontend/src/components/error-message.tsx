import React from "react";

export const ErrorMessage = (props: any): JSX.Element | null => {
    if (props.message === null) {
        return null;
    }
    return (
        <p style={{color: 'red'}}>
            {props.message}
        </p>
    )
}
