import React from 'react';

class Sheet extends React.Component {

    constructor(props) {
        super(props);

        this.isShow = props.isShow;

        this.state = {
            classOfSheetShow: 'hide'
        }
    }

    setSheetClassName = (className) => this.setState({classOfSheetShow: className});

    openSheet = () => this.setSheetClassName('')

    closeSheet = () => this.setSheetClassName('hide')

    clickHandler = (e) => {
        e.cancelBubble = true; // 阻止冒泡
        e.stopPropagation(); // 阻止冒泡
    }

    render() {
        return <>
            <div onClick={this.openSheet}>{this.props.button}</div>
            <div
                className={'sheet-mask ' + this.state.classOfSheetShow}
                onClick={this.closeSheet}>
                <div className="sheet-box" onClick={this.clickHandler}>
                    {/* 头部信息 */}
                    <div className="sheet-header">
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
