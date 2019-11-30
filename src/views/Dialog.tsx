import React, { useState } from 'react';
import Mask from './Mask';
import Close from './Close';

interface DialogProps{
    title?: string,
    content?: string,
    destroy?: Function
}

function Dialog(props: DialogProps) {

    const [isShow, setShow] = useState(true);
    const [isQuitting, setQuitting] = useState(false);

    const closeDialog = () => {
        if (typeof props.destroy === 'function') {
            props.destroy();
        } else {
            setShow(false);
        }
    }

    return isShow ?
        <div className="zui-dialog">
            <Mask quitting={isQuitting}></Mask>
            <div className="zui-dialog-area">
                <Close onClick={closeDialog}></Close>
                <div className="zui-dialog-title">{props.title}</div>
                <div className="zui-dialog-content">{props.content}</div>
                <div className="zui-dialog-button-box"></div>
            </div>
        </div>
        : null
}


export default Dialog;
