import React from 'react';

import { getClassName } from '../utils/base';

type StepType = {
    title: string,
    desc?: string
}

interface StepsProps {
    data: Array<StepType>,
    curStep: number,
    type: 'row' | 'col'
}

export default function Steps({data, curStep, type = 'col' }: StepsProps) {

    const stepsClassName = {
        [`zui-steps-${type}`]: true
    }

    const getStepClassName = (idx: number) => {
        let className = 'zui-step';
        if (curStep > (idx + 1)) {
            return className + ' zui-step-finish';
        }
        if (curStep === (idx + 1)) {
            return className + ' zui-step-active';
        }
        return className;
    }

    return <div className={"zui-steps".concat(getClassName(stepsClassName))}>
        {
            data.map((val, idx) => <div key={idx}
                className={getStepClassName(idx)}>
                <i className="zui-step-num">{idx + 1}</i>
                <div className="zui-step-area">
                    {val.title ? <p className="zui-step-title">{val.title}</p> : null}
                    <p className="zui-step-desc">{val.desc}</p>
                </div>
            </div>)
        }
    </div>
}