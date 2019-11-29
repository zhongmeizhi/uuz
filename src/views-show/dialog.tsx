import React from 'react';
import ReactDOM from 'react-dom';

import Dialog from '../views/Dialog'

interface showDialogProps {
    title?: string,
    content: string
}

const dialog: {[key: string]: any} = {
    _$eleList: [],
    notice(props: showDialogProps) {
        const $ele = document.createElement('div');
        this._$eleList.push($ele);
        document.body.appendChild($ele);
        ReactDOM.render(<Dialog title={props.title} content={props.content}></Dialog>, $ele);
    },
    destroy() {
        if (this._$eleList.length)  {
            const $ele = this._$eleList.pop();
            document.body.removeChild($ele);
            ReactDOM.unmountComponentAtNode($ele);
        }
    }
}

export default dialog;