import React from 'react'

interface ClickProps {
    onClick: Function
}

export default function Close(props: ClickProps) {

    const clickHandler = () => {
        if (typeof props.onClick === 'function') {
            props.onClick();
        }
    }
    
    return <div onClick={clickHandler}>x</div>
}