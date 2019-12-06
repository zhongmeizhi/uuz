import React, { useContext } from 'react';
import Dialog, { DialogContext } from './Dialog';
import Button from './Button';

import { typeCheck } from '../utils/base';

interface Alertprops {
    destroy?: Function,
    title?: React.ReactNode,
    content: React.ReactNode
}

export default function Alert({destroy, title, content}: Alertprops) {

    useContext(DialogContext);

    // if (typeCheck([
    //     ['destroy', destroy, 'Function', 'Undefined', 'Null'],
    //     ['title', title, 'String', 'Undefined', 'Null'],
    //     ['content', content, 'String'],
    // ])) return null;

    return <Dialog isBtnCloseOnly destroy={destroy}>
        <div className="zui-alert-title">{title}</div>
        <div className="zui-alert-content">{content}</div>
        {/* 利用 context 实现 slot 传参 */}
        <DialogContext.Consumer>
            {closeDialog => <Button onClick={closeDialog}>知道了</Button>}
        </DialogContext.Consumer>
    </Dialog>
}
