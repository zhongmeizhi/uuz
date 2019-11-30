import React from 'react';
import ReactDOM from 'react-dom';

import Dialog from '../views/Dialog'

interface showDialogProps {
    title?: string,
    content: string
}


class ShowSomething {

    _$ele: HTMLDivElement | undefined;

    notice = (props: showDialogProps) => {
        this._$ele = document.createElement('div');
        document.body.appendChild(this._$ele);
        ReactDOM.render(<Dialog title={props.title} content={props.content} destroy={this.destroy}></Dialog>, this._$ele);
    }

    destroy = () => {
        if (this._$ele)  {
            document.body.removeChild(this._$ele);
            ReactDOM.unmountComponentAtNode(this._$ele);
        }
    }
}


class ShowDialog extends ShowSomething{
}


const dialog = new ShowDialog();

export default dialog;