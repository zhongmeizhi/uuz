import React from 'react';
import { getClassName } from '../utils/base';

interface SwitchProps {
    checked?: boolean,
    disabled?: boolean,
    onChange?: Function,
    activeName?: string,
    closeName?: string
}

export default function Switch({checked, disabled, onChange, activeName, closeName}: SwitchProps) {

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
            <p className="zui-switch-body">
                <span className="zui-switch-txt zui-on">{activeName}</span>
                <span className="zui-switch-txt zui-off">{closeName}</span>
            </p>
        </label>
    </div>
}
