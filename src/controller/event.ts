import { passiveSupported } from "../utils/base";

class EventControl {
    
    eventList: {[key: string]: Function};
    willPreventDefault: object | boolean;
    willNotPreventDefault: object | boolean;
    $ele: HTMLDivElement;

    constructor(ele: HTMLDivElement) {
        this.eventList = {};
        const isPassiveSupported = passiveSupported();
        this.willPreventDefault = isPassiveSupported ? { passive: false } : false;
        this.willNotPreventDefault = isPassiveSupported ? { passive: true } : false;
        this.$ele = ele;
    }

    createEventList(start: Function, move: Function, end: Function) {
        this.eventList =  {
            touchstart: start,
            mousedown: start,
            touchmove: move,
            mousemove: move,
            touchend: end,
            mouseup: end,
        }
    }

    listenerAllOfEle() {
        Object.keys(this.eventList).forEach(key => {
            const pd = key.indexOf('move') >= 0 ? this.willPreventDefault : this.willNotPreventDefault;
            this.$ele.addEventListener(key, this.eventList[key] as any, pd as any);
        })
    }

    removeAllOfEle() {
        Object.keys(this.eventList).forEach(key => {
            this.$ele.removeEventListener(key, this.eventList[key] as any);
        })
    }
}

export default EventControl;
