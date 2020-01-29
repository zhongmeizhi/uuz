import React from 'react';

import Sheet from '../../../views/Sheet';
import Button from '../../../views/Button';

function TestContent() {
    return Array(22).fill(0).map((val, idx) => <div key={idx}>内容部分 {idx}</div>)
}

function TestSheet() {
    return <div style={{margin: '33px 16px'}}>
        <Sheet
            titleTxt='sheet的标题'
            canModalClose
            button={<Button>点击弹出Sheet</Button>}>
            <TestContent></TestContent>
        </Sheet>
    </div>
}

export default TestSheet;