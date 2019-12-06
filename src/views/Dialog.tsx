import React, { useState } from 'react';
import Close from './sub-views/Close';
import Mask from './sub-views/Mask';

import { typeCheck } from '../utils/base';

interface DialogProps{
    children: React.ReactNode,
    isBtnCloseOnly?: boolean,
    destroy?: Function
}

// conext
export const DialogContext = React.createContext(() => {});

export default function Dialog({children, isBtnCloseOnly, destroy}: DialogProps) {
    const [isShow, setShow] = useState(true);
    const [showState, setShowState] = useState({
        isQuitting: false,
        areaClassName: 'zui-dialog-area'
    });

    // if (typeCheck([
    //     ['children', children, 'Element', 'String'],
    //     ['isBtnCloseOnly', isBtnCloseOnly, 'Boolean', 'Undefined'],
    //     ['destroy', destroy, 'Function', 'Undefined', 'Null'],
    // ])) return null;

    const closeDialog = () => {
        setShowState({
            isQuitting: true,
            areaClassName: 'zui-dialog-area zui-dialog-quit'
        });
    }

    const modalHandler = () => {
        if (isBtnCloseOnly) return;
        closeDialog();
    }

    const dialogTransitionEndHandler = () => {
        if (typeof destroy === 'function') {
            destroy();
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
                        isBtnCloseOnly ?
                            null:
                            <Close className="zui-dialog-close" onClick={closeDialog}></Close>
                    }
                    { children }
                </div>
            </div>
        </DialogContext.Provider>
        : null
}
