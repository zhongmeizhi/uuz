import React, { useState, useEffect, TouchEvent, MouseEvent } from 'react';
import PickerControl from '../../controller/picker';

import EventControl from '../../controller/event';

interface PickerColProps {
    list: Array<any>,
    value: ValueType,
    onChange?: Function
}

type ValueType = string | number;
type PickerEvent = TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>;

export default function PickerCol({list, value, onChange}: PickerColProps) {

    let colRef: HTMLDivElement | null;

    function initPickerControl (list: Array<any>, value: ValueType) {
        let index = list.findIndex(val => val.value === value);
        index = index === -1 ? 0 : index;
        return new PickerControl(index, list.length-1);
    }

    const pickControl = initPickerControl(list, value);
    const [colStyle, setColStyle] = useState(pickControl.colStyle)

    const onStartHandler = (e: PickerEvent) => {
        pickControl.onStart(e);
    }

    const onMoveHandler = (e: PickerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        pickControl.onMove(e);
        setColStyle(pickControl.colStyle);
    }

    const onEndHandler = (e: PickerEvent) => {
        const adjustTranIdx = pickControl.onEnd();
        setColStyle(pickControl.colStyle);
        const value = list[adjustTranIdx].value;
        if (typeof onChange === 'function') {
            onChange(value)
        }
    }
    
    useEffect(() => {
        const eventControl = new EventControl(colRef as HTMLDivElement);
        eventControl.createEventList(onStartHandler, onMoveHandler, onEndHandler);
        eventControl.listenerAllOfEle();
        return () => {
            eventControl.removeAllOfEle();
        }
    }, [])

    return <div className="zui-picker-col">
        <div
            className="zui-picker-col-mask"
            ref={ele => colRef = ele}>
        </div>
        <div
            className="zui-picker-col-area"
            style={{
                transition: colStyle.transition,
                transform: `translateY(${colStyle.translateY}px)`,
            }}>
            {
                list.map(item=> <div className="zui-picker-item"
                    key={item.value}>{item.label}</div>)
            }
        </div>
    </div>
}