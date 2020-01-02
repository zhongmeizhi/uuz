import React, {useState} from 'react'
import Keyboard from '../../src/views/Keyboard';
import Button from '../../src/views/Button';

export default () => {

    const [value, setValue] = useState('');

    const onChange = (val) => {
        setValue(val);
    }

    return <div style={{margin: '50px 16px'}}>
        <Keyboard
            onChange={onChange}
            header={<div className="test-value-box">{value}</div>}
            emitButton={<Button>打开键盘</Button>}
        ></Keyboard>
    </div>
};