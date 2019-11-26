import React, { PureComponent } from 'react'

import Button from '../views/Button'

import dialog from '../views-show/dialog'

class TestDialog extends PureComponent {

    openDialog = () => {
        dialog.notice();
    }

    closeDialog = () => {
        dialog.destroy();
    }

    render() {
        return (
            <div>
                <Button onClick={this.openDialog}>打开dialog</Button>
                <br></br>
                <Button onClick={this.closeDialog}>关闭 dialog</Button>
            </div>
        )
    }
}

export default TestDialog;