import React, { useState } from 'react';
import Mask from './Mask';
import Close from './Close';

interface DialogProps{
    children: React.ReactNode,
    isBtnCloseOnly?: boolean,
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

    const modalHandler = () => {
        if (props.isBtnCloseOnly) {
            return;
        }
        closeDialog();
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
            <Mask quitting={showState.isQuitting} modalHandler={modalHandler}></Mask>
            <div className={showState.areaClassName} onTransitionEnd={dialogTransitionEndHandler}>
                {
                    props.isBtnCloseOnly ?
                        null:
                        <Close className="zui-dialog-close" onClick={closeDialog}></Close>
                }
                {/* { props.children } */}
                {
                    React.Children.map(props.children, (child: any) => {
                        return React.cloneElement(child, {
                        });
                    })
                   
                }
            </div>
        </div>
        : null
}


export default Dialog;
