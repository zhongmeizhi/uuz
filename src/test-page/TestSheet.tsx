import React from 'react';

import Sheet from '../views/Sheet';
import Button from '../views/Button';

class TestSheet extends React.Component {

    render() {
        return <Sheet
            titleTxt='sheet的标题'
            canModalClose
            button={<Button>点击弹出Sheet</Button>}>
            <div>内容部分1</div>
            <div>内容部分2</div>
            <div>内容部分3</div>
            <div>内容部分4</div>
            <div>内容部分5</div>
            <div>内容部分6</div>
        </Sheet>
    }
}

export default TestSheet;