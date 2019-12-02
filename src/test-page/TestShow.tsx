import React, { useState } from 'react'

import Button from '../views/Button'
import { dialog, alert, confirm } from '../views-show/dialog'

import testImg from '../static/test.jpg';

function TestContent(props: any) {
    return <div>
        <span>测试Dialog,测试Dialog,</span>
        <img width="60px" src={testImg} alt="测试图片" />
    </div>
}

export default function TestDialog() {

    const [alertTxt, setAlertTxt] = useState('未执行Alert')
    const [confirmTxt, setConfirmTxt] = useState('未执行Confirm')
    

    const openDialog = () => {
        dialog.show(<TestContent></TestContent>);
    }

    const openAlert = () => {
        setAlertTxt('打开 Alert');
        alert.show({
            title: <div>这里是标题</div>,
            content: <TestContent></TestContent>,
            onClose: () => {
                setAlertTxt('收到关闭 Alert 回调');
            }
        });
    }

    const openConfirm = () => {
        setConfirmTxt('打开 Confirm');
        confirm.show({
            title: '标题咯',
            content: '哒哒哒。拉面好吃吗？阔落好喝吗？听说猪肉又涨价了。滴滴滴。滴滴滴滴滴滴。滴滴滴',
            onCancel: () => {
                setConfirmTxt('取消 Confirm');
            },
            onConfirm: () => {
                setConfirmTxt('确认 Confirm');
            }
        });
    }

    return (
        <div>
            <Button disabled>不让点的按钮</Button>
            <br></br>
            <Button type="raw" onClick={openDialog}>打开Dialog</Button>
            <br></br>
            <Button onClick={openAlert}>打开Alert</Button>
            { alertTxt }
            <br></br>
            <Button onClick={openConfirm}>打开Confirm</Button>
            { confirmTxt }
            <br></br>
        </div>
    )
}
