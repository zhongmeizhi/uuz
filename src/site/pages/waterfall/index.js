import React from 'react';
import Waterfall from '../../../views/Waterfall'

import data from './data.js'


function SubBody(props) {
    return <div>
        <p className="zui-waterfall-txt">{props.txt}</p>
    </div>
}

export default () => {

    function getSize(url) {
        const sizeReg = url.match(/__(\d{1,8})\*(\d{1,8})./)
        return {
            width: Number(sizeReg[1]),
            height: Number(sizeReg[2]),
        }
    }

    const formatData = data.map(val => {
        const size = getSize(val.url)
        return Object.assign({}, val, size)
    })

    return <div>
        <Waterfall data={formatData} col={3} childRender={SubBody}></Waterfall>
    </div>
}