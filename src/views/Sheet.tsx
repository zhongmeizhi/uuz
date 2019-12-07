import React, { useState, ReactNode, MouseEvent } from 'react';

interface SheetProps {
    children: ReactNode,
    button: ReactNode, // 触发Sheet的按钮
    titleTxt?: string,
    canModalClose?: boolean,
    ensureHandler?: Function
}

export default  function Sheet(props: SheetProps) {
    const [isShow, setIsShow] = useState(false);
    const [sheetClassName, setSheetClassName] = useState('zui-sheet-box');

    const modalHandler = () => {
        props.canModalClose && closeSheet()
    }

    const closeSheet = () => {
        setSheetClassName('zui-sheet-box zui-quit')
    }

    const transitionEndHandler = () => {
        setIsShow(false);
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

    const bodyTansitionEndHandler = (e: any): void => {
        e.stopPropagation(); // 阻止冒泡
    }

    return <>
        <div onClick={() => setIsShow(true)}>{props.button}</div>
        {   
            isShow ?
                <div className={sheetClassName} onTransitionEnd={transitionEndHandler}>
                    <div className="zui-sheet-mask" onClick={modalHandler}></div>
                    {/* sheet主体 */}
                    <div className="zui-sheet-area">
                        {/* 头部信息 */}
                        <div className="zui-sheet-header">
                            <div onClick={closeSheet}>取消</div>
                            <div>{props.titleTxt || ''}</div>
                            <div onClick={clickHandler}>确定</div>
                        </div>
                        {/* 内容部分 */}
                        <div
                            className="zui-sheet-body"
                            onTransitionEnd={bodyTansitionEndHandler}
                        >{props.children}</div>
                    </div>
                </div>
                : null
        }
    </>
}
