import React from 'react';
import ReactDOM from 'react-dom';

import Dialog from '../views/Dialog'
import Alert from '../views/Alert';

class ShowSomething {
    _$ele: HTMLDivElement | undefined;

    renderElement = (Component: React.FunctionComponentElement<any>) => {
        this._$ele = document.createElement('div');
        document.body.appendChild(this._$ele);
        ReactDOM.render(Component, this._$ele);
    }

    destroy = () => {
        if (this._$ele)  {
            document.body.removeChild(this._$ele);
            ReactDOM.unmountComponentAtNode(this._$ele);
        }
    }
}

/* 
    Dialog
*/
class ShowDialog {
    _showSomething: ShowSomething;
    constructor () {
        this._showSomething = new ShowSomething();
    }

    show = (children: React.ReactNode) => {
        this._showSomething.renderElement(<Dialog destroy={this.destroy}>{children}</Dialog>)
    }

    destroy = () => this._showSomething.destroy();
}

/* 
    Alert
*/
interface AlertProps {
    onClose?: Function,
    title?: React.ReactNode,
    content: React.ReactNode
}

class ShowAlert {
    _showSomething: ShowSomething;
    constructor () {
        this._showSomething = new ShowSomething();
    }

    show = (props: AlertProps) => {
        const destroy = () => {
            if (typeof props.onClose === 'function') {
                props.onClose();
            }
            this.destroy();
        }

        this._showSomething.renderElement(<Alert destroy={destroy} {...props}></Alert>)
    }

    destroy = () => this._showSomething.destroy();
}

/*
    导出
 */
export const dialog = new ShowDialog();
export const alert = new ShowAlert();
