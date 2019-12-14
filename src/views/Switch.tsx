import React from 'react';
import { getClassName } from '../utils/base';

interface SwitchProps {
    checked?: boolean,
    disabled?: boolean,
    onChange?: Function
}

export default function Switch({checked, disabled, onChange}: SwitchProps) {

    const switchClassNames = {
        'zui-switch-disabled': disabled,
        'zui-switch-checked': checked
    }

    const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        (typeof onChange === 'function') && onChange(checked)
    }

    return <div className={"zui-switch".concat(getClassName(switchClassNames))}>
        <label>
            <input
                type="checkbox"
                checked={checked}
                onChange={valueChangeHandler}
                hidden
            ></input>
            <i className="zui-switch-body"></i>
        </label>
    </div>
}
