import React from 'react';
import {getClassName} from '../utils/base'

interface CheckBoxProps {
    checked?: boolean,
    children?: React.ReactNode,
    disabled?: boolean,
    onChange?: Function,
    type?: string
}

export default function CheckBox({checked, children, disabled, onChange, type = 'primary'}: CheckBoxProps) {

    const checkClassNames = {
        'zui-check-disabled': disabled,
        'zui-checked': checked,
        // primary || round
        [`zui-check-${type}`]: true
    }

    const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        (typeof onChange === 'function') && onChange(checked)
    }

    return <label className={"zui-checkbox".concat(getClassName(checkClassNames))}>
        <i className="zui-check"></i>
        <input
            type="checkbox"
            checked={checked}
            hidden
            onChange={valueChangeHandler}
        ></input>
        {children}
    </label>
}
