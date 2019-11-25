import React, { Component, TouchEvent } from 'react';

interface PickerItem {
    value?: string,
    label?: string
}

interface PickerProps {
    data: Array<Array<PickerItem>>,
    values: Array<string | number>,
    onChange?: Function
}

interface PickerState {
    colStyleList: Array<any>,
}

interface GlobalAttr {
    curTouchY: number,
    translateList: Array<number>,
    pickIdxList: Array<number>,
    setCurTouchYOfAttrByEvent: Function,
    initPickIndexListByProps: Function,
    getTranslateYByIndex: Function,
    _LINE_HEIGHT: 20
}

const _attr: GlobalAttr = {
    curTouchY: 0,
    translateList: [],
    pickIdxList: [],
    setCurTouchYOfAttrByEvent(e: TouchEvent<HTMLDivElement>) {
        this.curTouchY = e.touches[0].pageY;
    },
    initPickIndexListByProps(props: PickerProps) {
        this.pickIdxList = props.values.map((val, idx) => {
            let pickIdx = props.data[idx].findIndex(sub => sub.value === val);
            return pickIdx === -1 ? 0 : pickIdx;
        });
    },
    getTranslateYByIndex(index: number) {
        let curTranslateY = 0;
        if (this.pickIdxList[index]) {
            curTranslateY = -this.pickIdxList[index] * this._LINE_HEIGHT;
        }
        return curTranslateY;
    },
    _LINE_HEIGHT: 20
}

class Picker extends Component<PickerProps, PickerState> {

    constructor(props: PickerProps) {
        super(props);

        _attr.initPickIndexListByProps(this.props);
        const colStyleList: Array<any> = this.initAttrAndGetColStyleListByProps();

        this.state = { colStyleList }
    }

    // 初始化全局属性 & 获取初始化的 colStyleList
    initAttrAndGetColStyleListByProps = (): Array<any> => {
        let colStyleList: Array<any> = []
        this.props.data.forEach((col, idx) => {
            let curTranslateY = _attr.getTranslateYByIndex(idx);

            // 。。。缓存translate
            _attr.translateList.push(curTranslateY);

            colStyleList.push({
                transition: 'none',
                transform: `translateY(${curTranslateY}px)`
            })
        })
        return colStyleList;
    }

    // 根据 index 修改列的style
    setColStyleListByIndex = (index: number, transition: string, transform: string) => {
        let colStyleList = this.state.colStyleList;
        colStyleList.splice(index, 1, { transition, transform })
        this.setState({ colStyleList })
    }

    // 获取 调整后的最终 translate 和 当前的选择的 index
    getAdjustTranslateAndPickIndexByIndex = (idx: number) => {
        let adjustTranslate;
        let pickIdx;
        const maxIdx = this.props.data[idx].length - 1;
        const curTransLate = _attr.translateList[idx];
        const maxTranslate = -maxIdx * _attr._LINE_HEIGHT;

        if (curTransLate > 0) {
            adjustTranslate = 0;
            pickIdx = 0;
        } else if (curTransLate < maxTranslate) {
            adjustTranslate = maxTranslate;
            pickIdx = maxIdx;
        } else {
            const curPickIdx = Math.round(curTransLate / _attr._LINE_HEIGHT);
            adjustTranslate = curPickIdx * _attr._LINE_HEIGHT;
            pickIdx = curPickIdx;
        }

        return {
            pickIdx,
            adjustTranslate
        };
    }

    // 手指触摸picker列开始
    colTouchStartHandler = (idx: number) => (e: TouchEvent<HTMLDivElement>) => {
        _attr.setCurTouchYOfAttrByEvent(e);
    }

    // 手指在picker列上移动
    colTouchMoveHandler = (idx: number) => (e: TouchEvent<HTMLDivElement>) => {
        const translateY = e.touches[0].pageY - _attr.curTouchY + _attr.translateList[idx];
        
        _attr.setCurTouchYOfAttrByEvent(e);
        _attr.translateList[idx] = translateY;

        this.setColStyleListByIndex(idx, 'none', `translateY(${translateY}px)`)
    }

    // 手指抬起 完成Pick
    colTouchEndHandler = (idx: number) => (e: TouchEvent<HTMLDivElement>) => {

        const { pickIdx, adjustTranslate } = this.getAdjustTranslateAndPickIndexByIndex(idx);

        _attr.pickIdxList[idx] = pickIdx;
        _attr.translateList[idx] = adjustTranslate;

        const values = this.props.data.map((val, i) => val[_attr.pickIdxList[i]].value)
        if (typeof this.props.onChange === 'function') {
            this.props.onChange({
                values: values,
                indexes: _attr.pickIdxList
            })
        }

        this.setColStyleListByIndex(idx, 'all 0.3s', `translateY(${adjustTranslate}px)`);
    }

    render() {
        return <div className="zui-picker">
            {
                this.props.data.map((list, idx) => <div key={idx} 
                className="zui-picker-col">
                    <div
                        className="zui-picker-col-mask"
                        onTouchStart={this.colTouchStartHandler(idx)}
                        onTouchMove={this.colTouchMoveHandler(idx)}
                        onTouchEnd={this.colTouchEndHandler(idx)}>
                    </div>
                    <div
                        className="zui-picker-col-area"
                        style={this.state.colStyleList[idx]}>
                        {
                            list.map(item=> <div className="zui-picker-item"
                                key={item.value}>{item.label}</div>)
                        }
                    </div>
                </div>)
            }
        </div>
    }
}

export default Picker;