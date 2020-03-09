import React, {useState} from 'react'
import Checkbox from '../../../views/Checkbox';

export default () => {

    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(true);
    const [checked3, setChecked3] = useState(true);
    const [checked4, setChecked4] = useState(true);

    return <div style={{margin: '50px 16px'}}>
        <Checkbox checked={checked} onChange={setChecked}>选择框1</Checkbox>
        <br></br>
        <Checkbox checked={checked2} onChange={setChecked2} disabled>选择框2</Checkbox>
        <br></br>
        <Checkbox checked={checked3} onChange={setChecked3} type="round"><span>选择框3</span></Checkbox>
        <br></br>
        <Checkbox checked={checked4} onChange={setChecked4} type="round">
            <div style={{
                background: "wheat",
            }}>自定义内容</div>
        </Checkbox>
    </div>
};