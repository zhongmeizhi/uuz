import React, { useState } from 'react';
import Mask from './Mask';
import Close from './Close';

interface DialogProps{
    children: React.ReactNode,
    destroy?: Function
}

function Dialog(props: DialogProps) {

    const [isShow, setShow] = useState(true);
    const [showState, setShowState] = useState({
        isQuitting: false,
        areaClassName: 'zui-dialog-area'
    });

    const closeDialog = () => {
        setShowState({
            isQuitting: true,
            areaClassName: 'zui-dialog-area zui-dialog-quit'
        });
    }

    const dialogTransitionEndHandler = () => {
        if (typeof props.destroy === 'function') {
            props.destroy();
        } else {
            setShow(false);
        }
    }

    return isShow ?
        <div className="zui-dialog">
            <Mask quitting={showState.isQuitting} modalHandler={closeDialog}></Mask>
            <div className={showState.areaClassName} onTransitionEnd={dialogTransitionEndHandler}>
                <Close className="zui-dialog-close" onClick={closeDialog}></Close>
                {props.children}
            </div>
        </div>
        : null
}


export default Dialog;
