
class TrickleControl {

    data: Array<any>;
    // len: number;
    colData: Array<Array<any>>;
    col: number;
    curIdx: number;

    constructor() {
        this.data = [];
        // this.len = 0;
        this.colData = [];
        this.col = 0;
        this.curIdx = 0;
    }

    getColData() {
        return this.colData;
    }

    getCurIdx(): number {
        return this.curIdx;
    }

    setCol(col: number) {
        this.col = col;
    }

    setData(data: Array<any>) {
        this.data = data;
        // this.len = data.length;
    }
    
    addCurIdx(num = 1) {
        this.curIdx += num; 
    }

    setFirstRowData() {
        this.colData = this.data.slice(0, this.col).map(val => [val]);
        if (this.colData.length) {
            this.curIdx = this.colData.length - 1;
        }
    }

    _findLowCol(elements: Array<HTMLDivElement>) {
        const heightList = elements.map(ele => ele.offsetTop);
        const miniHeight = Math.min(...heightList);
        const targetIdx = heightList.indexOf(miniHeight);
        return targetIdx;
    }

    pushDataToLowCol(elements: Array<HTMLDivElement>) {
        const targetIdx = this._findLowCol(elements);
        this.addCurIdx();
        this.colData[targetIdx].push(this.data[this.curIdx]);
    }
}

export default TrickleControl;