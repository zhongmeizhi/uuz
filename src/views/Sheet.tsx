import React, { Component, ReactNode, MouseEvent } from 'react';

import styles from '../styles/index.module.scss';

interface SheetProps {
    children: ReactNode,
    button: ReactNode
}

interface SheetState {
    classOfSheetShow: String
}

class Sheet extends Component<SheetProps, SheetState> {

    constructor(props: SheetProps) {
        super(props);

        this.state = {
            classOfSheetShow: styles.hide
        }
    }

    setSheetClassName = (className: String) => this.setState({classOfSheetShow: className});

    openSheet = ():void => this.setSheetClassName('')

    closeSheet = ():void => this.setSheetClassName(styles.hide)

    clickHandler = (e: MouseEvent<HTMLElement>): void => {
        // e.cancelBubble = true; // 阻止冒泡
        e.stopPropagation(); // 阻止冒泡
    }

    render() {
        const sheetStyle = styles.sheetMask + ' ' + this.state.classOfSheetShow;

        return <>
            <div onClick={this.openSheet}>{this.props.button}</div>
            <div
                className={sheetStyle}
                onClick={this.closeSheet}>
                <div className={styles.sheetBox} onClick={this.clickHandler}>
                    {/* 头部信息 */}
                    <div className={styles.sheetHeader}>
                        <div onClick={this.closeSheet}>取消</div>
                        <div>标题</div>
                        <div>确定</div>
                    </div>
                    {/* 内容部分 */}
                    <div>{this.props.children}</div>
                </div>
            </div>
        </>
    }
}

export default Sheet;
