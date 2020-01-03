import React from 'react';
// import PropTypes from 'prop-types';

import  throttle from '../utils/throttle';
import { getClassName, getValOrDefault } from '../utils/base';

interface ButtonProps {
    className?: string,
    type?: string,
    disabled?: boolean,
    onClick?: Function,
    children: React.ReactNode,
    width?: string,
    height?: string,
    throttleTime?: number,
    avatar?: boolean
}

function Button({disabled, type, className, onClick, children, width, height, throttleTime = 200, avatar}: ButtonProps) {

    const throttleClick = throttle(onClick, throttleTime);

    const btnClassNames = {
        'zui-button-disbale': disabled,
        'zui-primary': !type,
        'zui-raw': type === 'raw',
        'zui-button-warn': type === 'warn',
        'zui-avatar': avatar
    }

    const sizeStyle: React.CSSProperties = {
        width: getValOrDefault(width, ''),
        height: getValOrDefault(height, ''),
        lineHeight: getValOrDefault(height, '')
    }

    const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
            e.stopPropagation();
        } else {
            (typeof onClick === 'function') && throttleClick();
        }
    }

    const buttonClassName: string = `zui-button ${className || ''} ${getClassName(btnClassNames)}`;

    return <div 
        className={buttonClassName}
        style={sizeStyle}
        onClick={clickHandler}>
        {children}
    </div>
}

// Button.propTypes  = {
//     className: PropTypes.string,
//     type: PropTypes.string,
//     disabled: PropTypes.bool,
//     onClick: PropTypes.func,
//     children: PropTypes.oneOfType([
//         PropTypes.element.isRequired,
//         PropTypes.string.isRequired,
//         PropTypes.number.isRequired,
//     ]),
//     width: PropTypes.string,
//     height: PropTypes.string
// }

export default Button;

