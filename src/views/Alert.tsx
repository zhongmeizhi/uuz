import React, { useContext } from 'react';
import Dialog, { DialogContext } from './Dialog';
import Button from './Button';

interface Alertprops {
    destroy?: Function,
    title?: React.ReactNode,
    content: React.ReactNode
}

export default function Alert(props: Alertprops) {

    useContext(DialogContext);

    return <Dialog isBtnCloseOnly destroy={props.destroy}>
        <div className="zui-alert-title">{props.title}</div>
        <div className="zui-alert-content">{props.content}</div>
        {/* 利用 context 实现 slot 传参 */}
        <DialogContext.Consumer>
            {closeDialog => <Button onClick={closeDialog}>知道了</Button>}
        </DialogContext.Consumer>
    </Dialog>
}
