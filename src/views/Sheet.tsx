import React, { PureComponent, ReactNode, MouseEvent } from 'react';

import {getDefaultVal} from '../utils/base';

interface SheetProps {
    children: ReactNode,
    button: ReactNode, // 触发Sheet的按钮
    titleTxt?: string,
    canModalClose?: boolean
}

interface SheetState {
    classOfSheetShow: string,
}

class Sheet extends PureComponent<SheetProps, SheetState> {

    canModalClose: boolean;

    constructor(props: SheetProps) {
        super(props);

        // 是否可以通过点击 遮罩层来关闭 Sheet
        this.canModalClose = getDefaultVal<boolean>(props.canModalClose, true)

        this.state = {
            classOfSheetShow: 'hide',
        }
    }

    setSheetClassName = (className: string) => this.setState({classOfSheetShow: className});

    openSheet = ():void => this.setSheetClassName('')

    closeSheet = ():void => this.setSheetClassName('hide')

    modalHandler = (): void => {
        this.canModalClose && this.closeSheet()
    }

    clickHandler = (e: MouseEvent<HTMLElement>): void => {
        // e.cancelBubble = true; // 阻止冒泡
        e.stopPropagation(); // 阻止冒泡
        this.closeSheet();
    }

    render() {
        const sheetStyle: string = `zui-sheet-mask ${this.state.classOfSheetShow}`;

        return <>
            <div onClick={this.openSheet}>{this.props.button}</div>
            <div
                className={sheetStyle}
                onClick={this.modalHandler}>
                <div className="zui-sheet-box">
                    {/* 头部信息 */}
                    <div className="zui-sheet-header">
                        <div onClick={this.closeSheet}>取消</div>
                        <div>{this.props.titleTxt}</div>
                        <div onClick={this.clickHandler}>确定</div>
                    </div>
                    {/* 内容部分 */}
                    <div>{this.props.children}</div>
                </div>
            </div>
        </>
    }
}

export default Sheet;
