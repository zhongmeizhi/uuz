import React, { PureComponent, ReactNode, MouseEvent } from 'react';

import {getDefaultVal} from '../utils/base';

interface SheetProps {
    children: ReactNode,
    button: ReactNode, // 触发Sheet的按钮
    titleTxt?: string,
    canModalClose?: boolean
}

interface SheetState {
    isShow: boolean,
    anmClassName: string
}

class Sheet extends PureComponent<SheetProps, SheetState> {

    canModalClose: boolean;

    constructor(props: SheetProps) {
        super(props);

        // 是否可以通过点击 遮罩层来关闭 Sheet
        this.canModalClose = getDefaultVal<boolean>(props.canModalClose, true)

        this.state = {
            isShow: false,
            anmClassName: ''
        }
    }

    openSheet = ():void => {
        this.setState({
            isShow: true
        })
    }

    closeSheet = ():void => {
        this.setState({
            anmClassName: 'quit'
        })
    }

    transitionEndHandler = () => {
        this.setState({
            isShow: false,
            anmClassName: ''
        })
    }

    modalHandler = (): void => {
        this.canModalClose && this.closeSheet()
    }

    clickHandler = (e: MouseEvent<HTMLElement>): void => {
        // e.cancelBubble = true; // 阻止冒泡
        e.stopPropagation(); // 阻止冒泡
        this.closeSheet();
    }

    render() {

        const sheetClassName = `zui-sheet-box ${this.state.anmClassName}`

        return <>
            <div onClick={this.openSheet}>{this.props.button}</div>
            {   
                this.state.isShow ?
                    <div className={sheetClassName}>
                        {/* sheet遮罩层 */}
                        <div
                            className='zui-sheet-mask'
                            onTransitionEnd={this.transitionEndHandler}
                            onClick={this.modalHandler}>
                        </div>
                        {/* sheet主体 */}
                        <div className="zui-sheet-area">
                            {/* 头部信息 */}
                            <div className="zui-sheet-header">
                                <div onClick={this.closeSheet}>取消</div>
                                <div>{this.props.titleTxt || ''}</div>
                                <div onClick={this.clickHandler}>确定</div>
                            </div>
                            {/* 内容部分 */}
                            <div>{this.props.children}</div>
                        </div>
                    </div>
                    : null
            }
        </>
    }
}

export default Sheet;
