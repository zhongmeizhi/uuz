import React, { PureComponent, TouchEvent } from 'react';

interface PickerItem {
    value: string,
    label: string
}

interface PickerProps {
    data: Array<Array<PickerItem>>
}

interface PickerState {
    translateYList: Array<Object>
}

const _attr = {
    curColIdx: 0,
    curStartY: 0,
    curDistanceY: 0
}


class Picker extends PureComponent<PickerProps, PickerState> {

    constructor(props: PickerProps) {
        super(props);

        const translateYList: Array<number> = this.props.data.map(col => {
            return 0
        })
        
        this.state = {
            translateYList: translateYList
        }
    }

    ensureHandler = () => {
        console.log('ensureHandler')
    }

    colTouchStartHandler = (idx: number) => (e: TouchEvent<HTMLDivElement>) => {
        console.log(idx)
        _attr.curColIdx = idx;
        _attr.curStartY = e.touches[0].pageY;
    }

    colTouchMoveHandler = (e: TouchEvent<HTMLDivElement>) => {
        const curTanslateY = this.state.translateYList[_attr.curColIdx];

    }

    render() {

        return <div className="zui-picker">
            {
                this.props.data.map((list, idx) => <div
                    // style={this.state.translateYList[idx]}
                    className="zui-picker-col"
                    onTouchStart={this.colTouchStartHandler(idx)}
                    onTouchMove={this.colTouchMoveHandler}
                    key={idx}>
                    {
                        list.map(item=> <div className="zui-picker-item"
                            key={item.value}>{item.label}</div>)
                    }
                </div>)
            }
        </div>
    }
}

export default Picker;