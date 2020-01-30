import React, { useState } from 'react';

import Picker from '../../../views/Picker';
import PickerView from '../../../views/PickerView';

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
        setValues1(values);
        console.log(values);
    }

    const changeHandler2 = (values) => {
        setValues2(values);
        console.log(values);
    }

    const ensureHandler = (values) => {
        console.log(values);
    }

    return <div>
        <div style={{textAlign: 'center', margin: '33px 0'}}>
            <p>使用了 touch 事件</p>
            <p>需使用手机模式</p>
        </div>
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