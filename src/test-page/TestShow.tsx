import React, { useState } from 'react'

import Button from '../views/Button'
import { dialog, alert } from '../views-show/dialog'

import testImg from '../static/test.jpg';

function TestContent(props: any) {
    return <div>
        <span>测试Dialog,测试Dialog,</span>
        <img width="60px" src={testImg} alt="测试图片" />
    </div>
}

export default function TestDialog() {

    const [alertTxt, setAlertTxt] = useState('未执行Alert')

    const openDialog = () => {
        dialog.notice(<TestContent></TestContent>);
    }

    const openAlert = () => {
        setAlertTxt('打开 Alert');
        alert.notice({
            title: <div>这里是标题</div>,
            content: <TestContent></TestContent>,
            onClose: () => {
                setAlertTxt('收到关闭 Alert 回调');
            }
        });
    }

    return (
        <div>
            <Button onClick={openDialog}>打开Dialog</Button>
            <br></br>
            <Button onClick={openAlert}>打开Alert</Button>
            { alertTxt }
            <br></br>
        </div>
    )
}
