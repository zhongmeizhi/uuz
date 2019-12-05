import React, { useState, ReactNode, MouseEvent } from 'react';
import Mask from './Mask';

interface SheetProps {
    children: ReactNode,
    button: ReactNode, // 触发Sheet的按钮
    titleTxt?: string,
    canModalClose?: boolean,
    ensureHandler?: Function
}

export default  function Sheet(props: SheetProps) {
    const [isShow, setIsShow] = useState(false);
    const [isQuitting, setIsQuitting] = useState(false);
    const [sheetClassName, setSheetClassName] = useState('zui-sheet-box');

    const modalHandler = () => {
        props.canModalClose && closeSheet()
    }

    const closeSheet = () => {
        setIsQuitting(true);
        setSheetClassName('zui-sheet-box zui-quit')
    }

    const transitionEndHandler = () => {
        setIsShow(false);
        setIsQuitting(false);
        setSheetClassName('zui-sheet-box')
    }

    const clickHandler = (e: MouseEvent<HTMLElement>): void => {
        // e.cancelBubble = true; // 阻止冒泡
        e.stopPropagation(); // 阻止冒泡
        if (typeof props.ensureHandler === 'function') {
            props.ensureHandler();
        }
        closeSheet();
    }

    return <>
        <div onClick={() => setIsShow(true)}>{props.button}</div>
        {   
            isShow ?
                <div className={sheetClassName}>
                    <Mask quitting={isQuitting} modalHandler={modalHandler}></Mask>
                    {/* sheet主体 */}
                    <div className="zui-sheet-area"
                        onTransitionEnd={transitionEndHandler}>
                        {/* 头部信息 */}
                        <div className="zui-sheet-header">
                            <div onClick={closeSheet}>取消</div>
                            <div>{props.titleTxt || ''}</div>
                            <div onClick={clickHandler}>确定</div>
                        </div>
                        {/* 内容部分 */}
                        <div className="zui-sheet-body">{props.children}</div>
                    </div>
                </div>
                : null
        }
    </>
}
