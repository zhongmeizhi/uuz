import React, { useState, TouchEvent } from 'react';

interface PickerColProps {
    list: Array<any>,
    onChange?: Function
}

const LINE_HEIGHT = 26;

// 写在function中的非useState的属性是不能被动态获取的
// 写在function外部没问题 - -
export default function PickerCol({list, onChange}: PickerColProps) {
    const [colStyle, setColStyle] = useState({
        translateY: 0,
        transition: 'none',
    })
    const [curTouchY, setCurTouchY] = useState(0);
    // const [pickIdx, setPickIdx] = useState(0);

    const getFinallyTranslate = () => {
        let adjustTranslate, adjustTranIdx;
        const maxIdx = list.length - 1;
        const curTransLateY = colStyle.translateY;
        const maxTranslate = - maxIdx * LINE_HEIGHT;

        if (curTransLateY > 0) {
            adjustTranslate = 0;
            adjustTranIdx = 0;
        } else if (curTransLateY < maxTranslate) {
            adjustTranslate = maxTranslate;
            adjustTranIdx = maxIdx;
        } else {
            const curPickIdx = Math.abs(Math.round(curTransLateY / LINE_HEIGHT));
            adjustTranslate = - curPickIdx * LINE_HEIGHT;
            adjustTranIdx = curPickIdx;
        }

        return { adjustTranIdx, adjustTranslate };
    }

    const colTouchStartHandler = (e: TouchEvent<HTMLDivElement>) => {
        setCurTouchY(e.touches[0].pageY);
    }

    const colTouchMoveHandler = (e: TouchEvent<HTMLDivElement>) => {
        const translateY = e.touches[0].pageY - curTouchY;
        setCurTouchY(e.touches[0].pageY);
        setColStyle({
            translateY: translateY + colStyle.translateY,
            transition: 'none'
        })
    }

    const colTouchEndHandler = (e: TouchEvent<HTMLDivElement>) => {
        const { adjustTranIdx, adjustTranslate } = getFinallyTranslate();
        const value = list[adjustTranIdx].value;
        if (typeof onChange === 'function') {
            onChange(value, adjustTranIdx)
        }
        // setPickIdx(adjustTranIdx);
        setColStyle({
            translateY: adjustTranslate,
            transition: 'all 0.3s'
        })
    }

    return <div className="zui-picker-col">
        <div
            className="zui-picker-col-mask"
            onTouchStart={colTouchStartHandler}
            onTouchMove={colTouchMoveHandler}
            onTouchEnd={colTouchEndHandler}>
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