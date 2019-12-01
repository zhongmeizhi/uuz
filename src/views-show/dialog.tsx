import React from 'react';
import ReactDOM from 'react-dom';

import Dialog from '../views/Dialog'


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

class ShowDialog {

    _showSomething: ShowSomething;

    constructor () {
        this._showSomething = new ShowSomething();
    }

    notice = (children: React.ReactNode) => {
        this._showSomething.renderElement(<Dialog destroy={this.destroy}>{children}</Dialog>)
    }

    destroy = () => {
        this._showSomething.destroy();
    }
}


export const dialog = new ShowDialog();
