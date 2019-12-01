import React, { PureComponent } from 'react'

import Button from '../views/Button'

import { dialog } from '../views-show/dialog'

function TestContent() {

    const csl = () => {
    }

    return <div>
        测试Dialog内容111
        <br></br>
        测试Dialog内容2222
        <br></br>
        <Button onClick={csl}>取消</Button>
    </div>
}

class TestDialog extends PureComponent {

    openDialog = () => {
        dialog.notice(<TestContent></TestContent>);
    }

    closeDialog = () => {
        dialog.destroy();
    }

    render() {
        return (
            <div>
                <Button onClick={this.openDialog}>打开dialog</Button>
            </div>
        )
    }
}

export default TestDialog;