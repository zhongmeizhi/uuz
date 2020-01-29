import React from 'react';

import Tabs from '../../../views/Tabs';

function TestTabs() {
    return <Tabs tabs={['标题1', 'tab2', '测试3', '呵呵', '收尾']}>
        <div>test</div>
        <div>test2</div>
        <div>
            迪斯科内容
            <br></br>
            迪斯科内容
            <br></br>
            迪斯科内容
            <br></br>
            迪斯科内容
            <br></br>
            迪斯科内容
        </div>
        <div>内容1</div>
        <div>内容2</div>
    </Tabs>
}

export default TestTabs;