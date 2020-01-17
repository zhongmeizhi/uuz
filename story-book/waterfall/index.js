import React from 'react';
import Waterfall from '../../src/views/Waterfall'

const data = Array(21).fill('data').map((val, idx) => {
    return {
        url: `https://zhongmeizhi.github.io/static/test/${20-idx}.jpg`,
        name: `瀑布流`,
        desc: `${idx}`
    }
})


function SubBody(props) {
    return <div>
        <img className="test-waterfall-img" alt="瀑布流"
            src={props.url}></img>
        <p className="zui-waterfall-txt">{props.name}</p>
        <p className="zui-waterfall-txt">{props.desc}</p>
    </div>
}

export default () => {
    return <div>
        <Waterfall data={data} col={3} childRender={SubBody}></Waterfall>
    </div>
}