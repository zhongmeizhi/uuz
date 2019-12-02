import React, { useContext } from 'react';
import Dialog, { DialogContext } from './Dialog';
import Button from './Button';

interface Confirmprops {
    destroy?: Function,
    onCancel?: Function,
    onConfirm?: Function,
    title?: React.ReactNode,
    content: React.ReactNode
}

export default function Confirm(props: Confirmprops) {

    useContext(DialogContext);

    const confirm = (closeDialog: Function) => () => {
        if (typeof props.onConfirm === 'function') {
            props.onConfirm();
        }
        closeDialog();
    }

    const cancel = (closeDialog: Function) => () => {
        if (typeof props.onCancel === 'function') {
            props.onCancel();
        }
        closeDialog();
    }

    return <Dialog isBtnCloseOnly destroy={props.destroy}>
        <div className="zui-confirm-title">{props.title}</div>
        <div className="zui-confirm-content">{props.content}</div>
        {/* 利用 context 实现 slot 传参 */}
        <DialogContext.Consumer>
            {closeDialog => <div className="zui-confirm-btn-box">
                <Button type="raw" onClick={cancel(closeDialog)}>取消</Button>
                <Button onClick={confirm(closeDialog)}>确定</Button>
            </div>}
        </DialogContext.Consumer>
    </Dialog>
}
