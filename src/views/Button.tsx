import React from 'react';

interface ButtonProps {
    className?: string,
    type?: string,
    disabled?: boolean,
    onClick?: Function,
    children: React.ReactNode
}

class Button extends React.PureComponent<ButtonProps> {

    clickHandler = (e: React.MouseEvent<HTMLElement>) => {
        if (this.props.disabled) {
            e.stopPropagation();
        } else {
            (typeof this.props.onClick === 'function') && this.props.onClick();
        }
    }

    render() {
        const type: string = this.props.type ? this.props.type : 'zui-primary';
        const disabledClassname = this.props.disabled ? 'zui-button-disbale' : '';
        const buttonClassName: string = `zui-button ${type} ${this.props.className || ''} ${disabledClassname}`;

        return <div 
            className={buttonClassName}
            onClick={this.clickHandler}>
            {this.props.children}
        </div>
    }
}

export default Button;

