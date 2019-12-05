import React from 'react';

interface ButtonProps {
    className?: string,
    type?: string,
    disabled?: boolean,
    onClick?: Function,
    children: React.ReactNode
}

export default function Button(props: ButtonProps) {

    const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
        if (props.disabled) {
            e.stopPropagation();
        } else {
            (typeof props.onClick === 'function') && props.onClick();
        }
    }

    let typeClassName: string = 'zui-';
    if (props.type) {
        typeClassName += props.type;
    } else {
        typeClassName += 'primary';
    }

    const disabledClassname: string = props.disabled ? 'zui-button-disbale' : '';
    const buttonClassName: string = `zui-button ${typeClassName} ${props.className || ''} ${disabledClassname}`;

    return <div 
        className={buttonClassName}
        onClick={clickHandler}>
        {props.children}
    </div>
}

