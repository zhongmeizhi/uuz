import React, { useState } from 'react';
import Close from './sub-views/Close';

// import { typeCheck } from '../utils/base';

interface DialogProps{
    children: React.ReactNode,
    isBtnCloseOnly?: boolean,
    destroy?: Function
}

// conext
export const DialogContext = React.createContext(() => {});

export default function Dialog({children, isBtnCloseOnly, destroy}: DialogProps) {

    const [dialogClassName, setDialogClassName] = useState('zui-dialog');

    // if (typeCheck([
    //     ['children', children, 'Element', 'String'],
    //     ['isBtnCloseOnly', isBtnCloseOnly, 'Boolean', 'Undefined'],
    //     ['destroy', destroy, 'Function', 'Undefined', 'Null'],
    // ])) return null;

    const closeDialog = () => {
        setDialogClassName('zui-dialog zui-dialog-quit');
    }

    const modalHandler = () => {
        if (isBtnCloseOnly) return;
        closeDialog();
    }

    const tansitionEndHandler = () => {
        (typeof destroy === 'function') && destroy();
    }

    return <DialogContext.Provider value={closeDialog}> {/** context 注入 */}
        <div className={dialogClassName} 
            onTransitionEnd={tansitionEndHandler}>
            <div className="zui-dialog-mask" onClick={modalHandler}></div>
            <div className="zui-dialog-area">
                {
                    isBtnCloseOnly ?
                        null:
                        <Close className="zui-dialog-close" onClick={closeDialog}></Close>
                }
                { children }
            </div>
        </div>
    </DialogContext.Provider>
}
