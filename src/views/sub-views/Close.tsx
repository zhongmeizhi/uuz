import React from 'react'

import { ReactComponent as CloseSvg } from '../../static/close.svg'

interface ClickProps {
    className?: string,
    onClick?: Function
}

export default function Close(props: ClickProps) {

    const clickHandler = () => {
        (typeof props.onClick === 'function') && props.onClick();
    }
    
    return <CloseSvg
        className={props.className || ''}
        onClick={clickHandler}
        width="16px"
        height="16px">
    </CloseSvg>
}