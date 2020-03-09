import React from 'react';

import Button from '../../../views/Button';
import { dialog, alert, confirm } from '../../../views-show/dialog';

import EnterTip from '../../layout/EnterTip';

const action = (val) => () => console.log(val)
const Gap = () => <div style={{height: '8px'}}></div>

export default  () => {
    const openDialog = () => {
        dialog.show(<EnterTip></EnterTip>);
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

    return <div style={{margin: '33px 16px'}}>
        <Button type="raw" onClick={openDialog}>打开Dialog</Button>
        <Gap></Gap>
        <Button type="warn" onClick={openAlert}>打开Alert</Button>
        <Gap></Gap>
        <Button onClick={openConfirm}>打开Confirm</Button>
    </div>
}