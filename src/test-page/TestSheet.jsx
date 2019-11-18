import React from 'react';

import Sheet from '../views/Sheet';

class SheetButton extends React.PureComponent {
    render() {
        return <button>弹出Sheet</button>
    }
}

class TestSheet extends React.Component {

    render() {
        return <Sheet
            titleTxt='sheet的标题'
            button={<SheetButton></SheetButton>}>
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