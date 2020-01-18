import React from 'react';
import { getClassName, getValOrDefault } from '../utils/base';

interface SwitchProps {
    checked?: boolean,
    disabled?: boolean,
    onChange?: Function,
    activeName?: string,
    closeName?: string,
    width?: string,
    type?: string
}

export default function Switch({checked, disabled, onChange, activeName, closeName, width, type = 'primary'}: SwitchProps) {

    const switchClassNames = {
        'zui-switch-disabled': disabled,
        'zui-switch-checked': checked,
        // primary || raw || square
        [`zui-switch-${type}`]: true
    }

    const sizeStyle: React.CSSProperties = {
        width: getValOrDefault(width, '')
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
            <p className="zui-switch-body" style={sizeStyle}>
                <span className="zui-switch-txt zui-on">{activeName}</span>
                <span className="zui-switch-txt zui-off">{closeName}</span>
            </p>
        </label>
    </div>
}
