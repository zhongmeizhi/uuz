import React, {useState} from 'react'
import Checkbox from '../../src/views/Checkbox';

export default () => {

    const [checked, setChecked] = useState(false);

    const onChange = (checked) => {
        setChecked(checked)
    }

    const [checked2, setChecked2] = useState(true);

    const onChange2 = (checked) => {
        setChecked2(checked2)
    }

    return <div>
        <Checkbox checked={checked} onChange={onChange}><span>选择框</span></Checkbox>
        <br></br>
        <Checkbox checked={checked2} onChange={onChange2} disabled><span>选择框</span></Checkbox>
    </div>
};