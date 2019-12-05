
import {TouchEvent} from 'react';

export interface PickerProps {
    data: Array<Array<{[key: string]: string}>>,
    values: Array<string | number>,
    className?: string,
    onChange?: Function
}

class PickerAttr {

    curTouchY: number;
    translateList: Array<number>;
    pickIdxList: Array<number>;
    LINE_HEIGHT: number;

    constructor() {
        this.curTouchY = 0;
        this.translateList = [];
        this.pickIdxList = [];
        this.LINE_HEIGHT = 26;
    }

    setCurTouchY(e: TouchEvent<HTMLDivElement>) {
        this.curTouchY = e.touches[0].pageY;
    }

    initPickIndexList(props: PickerProps) {
        this.pickIdxList = props.values.map((val, idx) => {
            let pickIdx = props.data[idx].findIndex(sub => sub.value === val);
            return pickIdx === -1 ? 0 : pickIdx;
        });
    }

    getTranslateY(index: number) {
        let curTranslateY = 0;
        if (this.pickIdxList[index]) {
            curTranslateY = -this.pickIdxList[index] * this.LINE_HEIGHT;
        }
        return curTranslateY;
    }
}

export default PickerAttr;
