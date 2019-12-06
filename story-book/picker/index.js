import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import Picker from '../../src/views/Picker';
import PickerView from '../../src/views/PickerView';

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
            label: '测试4'
        },{
            value: '55',
            label: '测试5'
        },
    ]
]


const TestPicker = () => {

    const [values1, setValues1] = useState(['2', '44']);
    const [values2, setValues2] = useState(['3', '22']);


    const changeHandler = (values) => {
        setValues1(values)
    }

    const changeHandler2 = (values) => {
        setValues2(values)
    }

    const ensureHandler = (values) => {
        action(values.toString())
    }

    return <div>
        <Picker
            data={data}
            values={values1}
            onChange={changeHandler}>
        </Picker>
        <br></br>
        <PickerView
            data={data}
            values={values2}
            onChange={changeHandler2}
            onEnsure={ensureHandler}>
        </PickerView>
    </div>
}

export default TestPicker;