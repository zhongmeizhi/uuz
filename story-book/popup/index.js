import React from 'react';
import { action } from '@storybook/addon-actions';

import Button from '../../src/views/Button';
import { dialog, alert, confirm } from '../../src/views-show/dialog';

export default  () => {
    const openDialog = () => {
        dialog.show(<div>xxxx<br></br>这里是内容</div>);
    }
    
    const openAlert = () => {
        alert.show({
            title: '这里是标题',
            content: '这里是内容,这里是内容,这里是内容这里是内容,这里是内容',
            onClose: () => {
                action('关闭');
            }
        });
    }
    
    const openConfirm = () => {
        confirm.show({
            title: '标题咯',
            content: '哒哒哒。拉面好吃吗？阔落好喝吗？听说猪肉又涨价了。滴滴滴。滴滴滴滴滴滴。滴滴滴',
            onCancel: () => {
                action('取消');
            },
            onConfirm: () => {
                action('确定');
            }
        });
    }

    return <>
        <Button onClick={openDialog}>打开Dialog</Button>
        <br></br>
        <Button type="raw" onClick={openAlert}>打开Alert</Button>
        <br></br>
        <Button onClick={openConfirm}>打开Confirm</Button>
    </>
}