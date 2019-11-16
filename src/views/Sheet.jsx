import React from 'react';

import styles from '../styles/index.module.scss';

class Sheet extends React.Component {

    constructor(props) {
        super(props);

        this.isShow = props.isShow;

        this.state = {
            classOfSheetShow: styles.hide
        }
    }

    setSheetClassName = (className) => this.setState({classOfSheetShow: className});

    openSheet = () => this.setSheetClassName('')

    closeSheet = () => this.setSheetClassName(styles.hide)

    clickHandler = (e) => {
        e.cancelBubble = true; // 阻止冒泡
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
