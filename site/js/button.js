import Keyboard from '../../../src/views/Keyboard.tsx';
import Button from '../../../src/views/Button.tsx';
import React, {useState} from 'react';

export default () => {
    const [value, setValue] = useState('');

    return <div>
        <Keyboard
            onChange={setValue}
            header={<div className="test-value-box">{value}</div>}
            emitButton={<Button>打开键盘</Button>}
        ></Keyboard>
    </div>
}
