import React, { useState } from 'react';
import PickerCol from './sub-views/PickerCol';

export interface PickerProps {
    data: Array<Array<{[key: string]: string}>>,
    values: Array<string | number>,
    className?: string,
    onChange?: Function
}

function Picker(props: PickerProps) {

    const [values, setValues] = useState(['', '']);
    const [indexes, setIndexes] = useState([0, 0]);

    const colChangeHandler = (idx: number) => (value: string, pickIdx: number) => {
        console.log(value, pickIdx)
        if (typeof props.onChange === 'function') {
            props.onChange(values, indexes);
        }
    }

    const pickerClassName = `zui-picker ${props.className || ''}`
    return <div className={pickerClassName}>
        {
            props.data.map((list, idx) => <PickerCol
                key={idx}
                list={list}
                onChange={colChangeHandler(idx)}
            ></PickerCol>)
        }
    </div>
}

export default Picker;