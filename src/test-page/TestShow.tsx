import React, { PureComponent } from 'react'

import Button from '../views/Button'
import { dialog, alert } from '../views-show/dialog'

import testImg from '../static/test.jpg';

function TestContent(props: any) {

    const csl = () => {
        console.log(props)
    }

    return <div>
        <span>测试Dialog,测试Dialog,</span>
        <img width="60px" src={testImg}/>
    </div>
}

class TestDialog extends PureComponent {

    openDialog = () => {
        dialog.notice(<TestContent></TestContent>);
    }

    openAlert = () => {
        alert.notice({
            title: <div>这里是标题</div>,
            content: <TestContent></TestContent>,
            onClose: () => {
                console.log('确定')
            }
        });
    }

    render() {
        return (
            <div>
                <Button onClick={this.openDialog}>打开Dialog</Button>
                <br></br>
                <Button onClick={this.openAlert}>打开Alert</Button>
                <br></br>
            </div>
        )
    }
}

export default TestDialog;