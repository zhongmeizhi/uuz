import React, {useState} from 'react'
import Switch from "../../src/views/Switch";

export default () => {
    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(true);

    return <div>
        <Switch checked={checked} onChange={(isChecked) => setChecked(isChecked)}></Switch>
        <Switch checked={checked2} onChange={(isChecked) => setChecked2(isChecked)}></Switch>
        <Switch disabled></Switch>
    </div>
}