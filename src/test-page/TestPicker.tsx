import React from 'react';

import Picker from '../views/Picker';
import PickerView from '../views/PickerView';

const data = [
    [
        {
            value: '1',
            label: 'test1'
        },{
            value: '2',
            label: 'test2'
        },{
            value: '3',
            label: 'test3'
        },{
            value: '4',
            label: 'test4'
        },{
            value: '5',
            label: 'test5'
        },
    ], [
        {
            value: '11',
            label: '测试1'
        },{
            value: '22',
            label: '测试2'
        },{
            value: '33',
            label: '测试3'
        },{
            value: '44',
            label: '测试5'
        },{
            value: '55',
            label: '测试5'
        },
    ]
]

interface TestPickerProps {
}

interface TestPickerState {
    values1: Array<string>,
    values2: Array<string>,
}

class TestPicker extends React.Component<TestPickerProps, TestPickerState> {

    constructor(prop: TestPickerProps) {
        super(prop);
        
        this.state = {
            values1: ['2', '44'],
            values2: ['1', '11']
        }
    }

    changeHandler = (values: Array<string>, indexes: Array<number>) => {
        this.setState({
            values1: values
        })
    }

    ensureHandler = (values: Array<string>, indexes: Array<number>) => {
        this.setState({
            values2: values
        })
    }

    render() {
        return <div>
            <Picker
                data={data}
                values={this.state.values1}
                onChange={this.changeHandler}>
            </Picker>
            <p>{'Picker values：' + this.state.values1.join(',')}</p>
            <br></br>
            <p>{'PickerView values：' + this.state.values2.join(',')}</p>
            <br></br>
            <PickerView
                data={data}
                values={this.state.values2}
                onEnsure={this.ensureHandler}>
            </PickerView>
        </div>
    }
}

export default TestPicker;