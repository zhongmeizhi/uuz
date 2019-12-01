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

interface showDialogProps {
    title?: string,
    content: string
}

class ShowDialog {

    _showSomething: ShowSomething;
    
    constructor () {
        this._showSomething = new ShowSomething();
    }

    notice = (props: showDialogProps) => {
        this._showSomething.renderElement(<Dialog {...props} destroy={this.destroy}></Dialog>)
    }

    destroy = () => {
        this._showSomething.destroy();
    }
}


export const dialog = new ShowDialog();
