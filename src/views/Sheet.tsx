import React, { Component, ReactNode, MouseEvent } from 'react';

import {getDefaultVal} from '../utils/base';
import styles from '../styles/index.module.scss';

interface SheetProps {
    children: ReactNode,
    button: ReactNode, // 触发Sheet的按钮
    titleTxt?: String,
    canModalClose?: Boolean
}

interface SheetState {
    classOfSheetShow: String,
}

class Sheet extends Component<SheetProps, SheetState> {

    canModalClose: Boolean;

    constructor(props: SheetProps) {
        super(props);

        // 是否可以通过点击 遮罩层来关闭 Sheet
        this.canModalClose = getDefaultVal<Boolean>(props.canModalClose, true)

        this.state = {
            classOfSheetShow: styles.hide,
        }
    }

    setSheetClassName = (className: String) => this.setState({classOfSheetShow: className});

    openSheet = ():void => this.setSheetClassName('')

    closeSheet = ():void => this.setSheetClassName(styles.hide)

    modalHandler = (): void => {
        this.canModalClose && this.closeSheet()
    }

    clickHandler = (e: MouseEvent<HTMLElement>): void => {
        // e.cancelBubble = true; // 阻止冒泡
        e.stopPropagation(); // 阻止冒泡
        this.closeSheet();
    }

    render() {
        const sheetStyle = styles.sheetMask + ' ' + this.state.classOfSheetShow;

        return <>
            <div onClick={this.openSheet}>{this.props.button}</div>
            <div
                className={sheetStyle}
                onClick={this.modalHandler}>
                <div className={styles.sheetBox}>
                    {/* 头部信息 */}
                    <div className={styles.sheetHeader}>
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
