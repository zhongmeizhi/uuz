import React, {useState} from 'react'
import Switch from "../../src/views/Switch";

export default () => {
    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(true);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(true);

    return <div style={{margin: '50px 16px'}}>
        <Switch checked={checked} onChange={setChecked}></Switch>
        <Switch checked={checked2} onChange={setChecked2}></Switch>
        <Switch disabled></Switch>
        <div style={{height: '6px'}}></div>
        <Switch checked={checked3} activeName="开" closeName="关" onChange={setChecked3}></Switch>
        <Switch checked={checked4} activeName="开" closeName="关" onChange={setChecked4}></Switch>
    </div>
}