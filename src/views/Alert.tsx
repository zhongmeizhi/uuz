import React from 'react';
import Dialog from './Dialog';
import Button from './Button';

interface Alertprops {
    destroy?: Function,
    title?: React.ReactNode,
    content: React.ReactNode
}

export default function Alert(props: Alertprops) {
    
    const closeAlert = () => {
        if (typeof props.destroy === 'function') {
            props.destroy();
        }
    }

    return <Dialog isBtnCloseOnly>
        <div className="zui-alert-title">{props.title}</div>
        <div className="zui-alert-content">{props.content}</div>
        <Button onClick={closeAlert}>知道了</Button>
    </Dialog>
}
