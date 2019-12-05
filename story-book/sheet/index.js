import React from 'react';

import Sheet from '../../src/views/Sheet';
import Button from '../../src/views/Button';

function TestContent() {
    return Array(22).fill(0).map((val, idx) => <div key={idx}>内容部分 {idx}</div>)
}

function TestSheet() {
    return <Sheet
        titleTxt='sheet的标题'
        canModalClose
        button={<Button>点击弹出Sheet</Button>}>
        <TestContent></TestContent>
    </Sheet>
}

export default TestSheet;