import React, { useState } from 'react';
import Mask from './Mask';
import Close from './Close';

interface DialogProps{
    children: React.ReactNode,
    isBtnCloseOnly?: boolean,
    destroy?: Function
}

// conext
export const DialogContext = React.createContext(() => {});

export default function Dialog(props: DialogProps) {
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
        if (props.isBtnCloseOnly) return;
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
        <DialogContext.Provider value={closeDialog}> {/** context 注入 */}
            <div className="zui-dialog">
                <Mask quitting={showState.isQuitting} modalHandler={modalHandler}></Mask>
                <div className={showState.areaClassName} onTransitionEnd={dialogTransitionEndHandler}>
                    {
                        props.isBtnCloseOnly ?
                            null:
                            <Close className="zui-dialog-close" onClick={closeDialog}></Close>
                    }
                    { props.children }
                </div>
            </div>
        </DialogContext.Provider>
        : null
}
