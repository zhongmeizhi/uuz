import React, {useState} from 'react'
import Switch from "../../../views/Switch";

function Gap () {
    return <div style={{height: '6px'}}></div>
}

export default () => {
    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(true);
    const [checked3, setChecked3] = useState(false);
    const [checked4, setChecked4] = useState(true);
    const [checked5, setChecked5] = useState(false);
    const [checked6, setChecked6] = useState(true);
    const [checked7, setChecked7] = useState(false);
    const [checked8, setChecked8] = useState(true);

    return <div style={{margin: '50px 16px'}}>
        <Switch checked={checked} onChange={setChecked}></Switch>
        <Switch checked={checked2} onChange={setChecked2}></Switch>
        <Switch disabled></Switch>
        <Gap></Gap>
        <Switch checked={checked3} activeName="开" closeName="关" onChange={setChecked3}></Switch>
        <Switch checked={checked4} activeName="开" closeName="关" onChange={setChecked4}></Switch>
        <Gap></Gap>
        <Switch checked={checked5} type="raw" onChange={setChecked5}></Switch>
        <Switch checked={checked6} width="80px" onChange={setChecked6}></Switch>
        <Gap></Gap>
        <Switch checked={checked7} type="square" activeName="on" closeName="off" onChange={setChecked7}></Switch>
        <Switch checked={checked8} type="square" width="60px" onChange={setChecked8}></Switch>
    </div>
}