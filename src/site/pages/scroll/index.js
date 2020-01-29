import React, { useState } from 'react';

import Scroll from '../../../views/Scroll'

function TestContent(props) {
    return Array(props.num).fill(0).map((val, idx) => {
        return <div className="test-content" key={idx}>{idx + 1}：需用手机模式测试</div>
    })
}

function TestReFresh() {

    const [num, setNum] = useState(50);

    const freshHandler = () => {
        setNum(50)
    }

    const loadHandler = () => {
        setNum(num + 30);
    }

    return <Scroll
        className="test-fresh"
        freshHandler={freshHandler}
        loadHandler={loadHandler}>
        <TestContent num={num}></TestContent>
    </Scroll>
}

export default TestReFresh;