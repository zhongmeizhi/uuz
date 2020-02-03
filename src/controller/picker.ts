import { TouchEvent, MouseEvent } from 'react';
import { getEventPoint } from '../utils/base';

type PickerEvent = TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>;

class PickerControl {
    colStyle: {
        translateY: number,
        transition: string
    };
    LINE_HEIGHT: number;
    maxIdx: number
    curY: number;
    oldY: number;
    isAnm: boolean;

    constructor(index: number, maxIdx: number) {
        this.LINE_HEIGHT = 26;
        this.maxIdx = maxIdx
        this.colStyle = {
            translateY: - (index * this.LINE_HEIGHT),
            transition: 'none',
        }
        this.curY = 0;
        this.oldY = 0;
        this.isAnm = false;
    }

    getFinallyTranslate() {
        let adjustTranslate, adjustTranIdx;
        const curTransLateY = this.colStyle.translateY;
        const maxTranslate = - this.maxIdx * this.LINE_HEIGHT;

        if (curTransLateY > 0) {
            adjustTranslate = 0;
            adjustTranIdx = 0;
        } else if (curTransLateY < maxTranslate) {
            adjustTranslate = maxTranslate;
            adjustTranIdx = this.maxIdx;
        } else {
            const curPickIdx = Math.abs(Math.round(curTransLateY / this.LINE_HEIGHT));
            adjustTranslate = - curPickIdx * this.LINE_HEIGHT;
            adjustTranIdx = curPickIdx;
        }

        return { adjustTranIdx, adjustTranslate };
    }

    onStart(e: PickerEvent) {
        this.curY = getEventPoint(e).pageY;
        this.oldY = this.colStyle.translateY;
        this.isAnm = true;
    }

    onMove(e: PickerEvent) {
        if (this.isAnm) {
            const translateY = getEventPoint(e).pageY - this.curY;
            this.colStyle = {
                translateY: translateY + this.oldY,
                transition: 'none'
            };
        }
    }

    onEnd(): number {
        this.isAnm = false;
        const { adjustTranIdx, adjustTranslate } = this.getFinallyTranslate();
        this.colStyle = {
            translateY: adjustTranslate,
            transition: 'all 0.3s'
        }
        return adjustTranIdx;
    }
}

export default PickerControl;