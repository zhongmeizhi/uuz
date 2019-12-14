import React from 'react';
import { getClassName } from '../utils/base';

interface ButtonProps {
    className?: string,
    type?: string,
    disabled?: boolean,
    onClick?: Function,
    children: React.ReactNode
}

export default function Button({disabled, type, className, onClick, children}: ButtonProps) {

    const btnClassNames = {
        'zui-button-disbale': disabled,
        'zui-primary': !type,
        'zui-raw': type === 'raw',
    }

    const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
            e.stopPropagation();
        } else {
            (typeof onClick === 'function') && onClick();
        }
    }

    const buttonClassName: string = `zui-button ${className || ''} ${getClassName(btnClassNames)}`;

    return <div 
        className={buttonClassName}
        onClick={clickHandler}>
        {children}
    </div>
}

