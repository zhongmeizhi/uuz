import React from 'react'
import Steps from "../../../views/Steps";

const data = [
    {
        title: '开始',
        desc: '您拨打的电话以停机'
    }, {
        title: '步骤2',
        desc: '快点去冲话费'
    }, {
        title: '步骤3',
        desc: '话费已到账,很多很多文字,很多很多文字,很多很多文字,很多很多文字,很多很多文字'
    }, {
        title: '完成',
        desc: '浪去咯'
    }
];

export default () => {
    return <div>
        <Steps data={data} curStep={3}></Steps>
        <br/>
        <Steps data={data} type="row" curStep={2}></Steps>
    </div>
}