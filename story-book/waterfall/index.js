import React from 'react';
import Waterfall from '../../src/views/Waterfall'

const data = Array(21).fill('data').map((val, idx) => {
    return {
        url: `https://zhongmeizhi.github.io/static/test/${idx}.jpg`,
        name: `图片${idx}`
    }
})

export default () => {
    return <Waterfall data={data} col={3}></Waterfall>
}