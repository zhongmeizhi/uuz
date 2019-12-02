import React from 'react';
import ReactDOM from 'react-dom';

import Dialog from '../views/Dialog'
import Alert from '../views/Alert';
import Confirm from '../views/Confirm';

class PopUpBox {
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

class ShowSomething {
    _showSomething: PopUpBox;
    constructor () {
        this._showSomething = new PopUpBox();
    }

    show: Function = () => new Error('需要重写 show 方法');

    destroy = () => this._showSomething.destroy();
}

/* 
    Dialog
*/
class ShowDialog extends ShowSomething{
    show = (children: React.ReactNode) => {
        this._showSomething.renderElement(<Dialog destroy={this.destroy}>{children}</Dialog>)
    }
}

/* 
    Alert
*/
interface AlertProps {
    onClose?: Function,
    title?: React.ReactNode,
    content: React.ReactNode
}

class ShowAlert extends ShowSomething{
    show = (props: AlertProps) => {
        const destroy = () => {
            if (typeof props.onClose === 'function') {
                props.onClose();
            }
            this.destroy();
        }
        this._showSomething.renderElement(<Alert destroy={destroy} {...props}></Alert>)
    }
}

/* 
    Confirm
*/
interface ConfirmProps {
    onCancel?: Function,
    onConfirm?: Function,
    title?: React.ReactNode,
    content: React.ReactNode
}

class ShowConfirm extends ShowSomething {
    show = (props: ConfirmProps) => {
        this._showSomething.renderElement(<Confirm destroy={this.destroy} {...props}></Confirm>)
    }
}

/*
    导出
 */
export const dialog = new ShowDialog();
export const alert = new ShowAlert();
export const confirm = new ShowConfirm();
