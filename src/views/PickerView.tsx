import React, { useState } from 'react';

import Sheet from './Sheet';
import Button from './Button';
import Picker from './Picker'

interface PickerViewProps {
    data: Array<Array<{[key: string]: string}>>,
    values: Array<string | number>,
    onChange?: Function,
    onEnsure?: Function
}

interface GlobalAttr {
    values: Array<string>,
    indexes: Array<number>
}

function PickerView(props: PickerViewProps) {

    const [pickObj, setValue] = useState({values: [], indexes: []} as GlobalAttr);

    const ensureHandler = () => {
        if (typeof props.onEnsure === 'function') {
            props.onEnsure(pickObj.values, pickObj.indexes)
        }
    }

    const changeHandler = (values: Array<string>, indexes: Array<number>) => {
        setValue({ values, indexes });
        if (typeof props.onChange === 'function') {
            props.onChange(values, indexes)
        }
    }

    return <Sheet
        ensureHandler={ensureHandler}
        button={<Button>弹出Picker</Button>}>
        <Picker
            className="zui-picker-view"
            data={props.data}
            values={props.values}
            onChange={changeHandler}
        ></Picker>
    </Sheet>
}

export default PickerView;