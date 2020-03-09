import React, { useState, ReactNode, MouseEvent, useEffect } from 'react';
import Transition from './Transition';

import { ShowSomething } from '../views-show/dialog';

interface SheetProps {
    children: ReactNode,
    button: ReactNode, // 触发Sheet的按钮
    header?: ReactNode,
    titleTxt?: string,
    canModalClose?: boolean,
    ensureHandler?: Function
}

export default  function Sheet(props: SheetProps) {
    const [isShow, setIsShow] = useState(false);
    const [showSomething] = useState(new ShowSomething());

    const modalHandler = () => {
        setIsShow(false);
    }

    const closeSheet = () => {
        setIsShow(false);
    }

    const clickHandler = (e: MouseEvent<HTMLElement>): void => {
        // e.cancelBubble = true; // 阻止冒泡
        e.stopPropagation(); // 阻止冒泡
        if (typeof props.ensureHandler === 'function') {
            props.ensureHandler();
        }
        closeSheet();
    }

    useEffect(() => {
        showSomething.renderElement(SheetContent);
    });

    useEffect(() => {
        return () => showSomething.destroy();
    }, [])

    const SheetContent = (
        <Transition name="zui-sheet" isShow={isShow}>
            <div className='zui-sheet-box'>
                <div className="zui-sheet-mask" onClick={modalHandler}></div>
                {/* sheet主体 */}
                <div className="zui-sheet-area">
                    {/* 头部信息 */}
                    {
                        props.header ?
                            props.header :
                            <div className="zui-sheet-header">
                                <div onClick={closeSheet}>取消</div>
                                <div>{props.titleTxt || ''}</div>
                                <div onClick={clickHandler}>确定</div>
                            </div>
                    }
                    {/* 内容部分 */}
                    <div
                        className="zui-sheet-body"
                    >{props.children}</div>
                </div>
            </div>
        </Transition>
    )
    
    return <>
        <div onClick={() => setIsShow(true)}>{props.button}</div>
    </>
}
