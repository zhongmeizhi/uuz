import React, { useState } from 'react';

import ReFresh from '../../src/views/ReFresh'

function TestContent(props) {
    return Array(props.num).fill(0).map((val, idx) => {
        return <div className="test-content" key={idx}>第{idx + 1}个</div>
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

    return <ReFresh
        className="test-fresh"
        freshHandler={freshHandler}
        loadHandler={loadHandler}>
        <TestContent num={num}></TestContent>
    </ReFresh>
}

export default TestReFresh;