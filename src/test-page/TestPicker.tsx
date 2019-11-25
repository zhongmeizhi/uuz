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

class TestPicker extends React.Component {

    changeHandler = (values: Array<string>, indexes: Array<number>) => {
        console.log(values, indexes)
    }

    ensureHandler = (values: Array<string>, indexes: Array<number>) => {
        console.log(values, indexes)
    }

    render() {
        return <div>
            <Picker
                data={data}
                values={['2', '44']}
                onChange={this.changeHandler}>
            </Picker>
            <PickerView
                data={data}
                values={['3', '22']}
                onEnsure={this.ensureHandler}>
            </PickerView>
        </div>
    }
}

export default TestPicker;