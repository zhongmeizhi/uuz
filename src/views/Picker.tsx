import React, { useState } from 'react';
import PickerCol from './sub-views/PickerCol';

// import { typeCheck } from '../utils/base';

export interface PickerProps {
    data: Array<Array<{[key: string]: string}>>,
    values: Array<string | number>,
    className?: string,
    onChange?: Function
}

function Picker({data, values, className, onChange}: PickerProps) {

    const [pickValues, setValues] = useState(['', '']);

    // if (typeCheck([
    //     ['data', data, 'Array'],
    //     ['values', values, 'Array'],
    //     ['className', className, 'String', 'Undefined', 'Null'],
    //     ['onChange', onChange, 'Function', 'Undefined', 'Null']
    // ])) return null;

    const colChangeHandler = (idx: number) => (value: string, pickIdx: number) => {
        setValues((oldState) => {
            oldState.splice(idx, 1, value);
            return oldState;
        })
        onChange && onChange(pickValues);
    }

    const pickerClassName = `zui-picker ${className || ''}`

    return <div className={pickerClassName}>
        {
            data.map((list, idx) => <PickerCol
                key={idx}
                value={values[idx]}
                list={list}
                onChange={colChangeHandler(idx)}
            ></PickerCol>)
        }
    </div>
}

export default Picker;