import MoveControl from './move';

type Point = {
    x: number,
    y: number
}

enum DistanceStatus { 'EMPTY', 'HALF', 'DONE' }

type Status = 'update' | 'reset' | 'none';

class ScrollControl extends MoveControl {
    
    Refresh_Distance: number;
    distanceStatus?: DistanceStatus;
    isRefreshable: boolean;
    beginTime?: number;
    matLimit: number;

    constructor() {
        super({direction: 'y'});
        this.Refresh_Distance = 90;
        this.isRefreshable = true;
        this.matLimit = 0.7;
    }

    _getFinalEndPonit(): Point {
        return {
            x: 0,
            y: 0
        };
    }

    _resetSomething() {
        this._markBeginTime();
        this.distance[this.direction] = 0;
    }

    _markBeginTime() {
        this.beginTime = Date.now();
    }

    _getTimeTotal(): number {
        const endTime = Date.now();
        const moveTime = endTime - this.beginTime!;
        return moveTime;
    }

    getExpectMat(): number {
        const distanceTotal = this.getMoveDist();
        const moveTime = this._getTimeTotal();
        // 速度 = 路程 / 时间
        const speed = distanceTotal / moveTime;
        if (speed < this.matLimit && speed > -this.matLimit) {
            return 0
        }
        // 计算期望缓冲距离
        const mat = speed * 456;
        return mat;
    }

    setRefreshAble(isRefreshable: boolean) {
        this.isRefreshable = isRefreshable;
    }

    resetRefreshStatus() {
        this.distanceStatus = DistanceStatus.EMPTY;
    }

    markScrollTip(): string {
        let tip = '';
        const dist = this.getMoveDist();
        if (dist > this.Refresh_Distance) {
            this.distanceStatus = DistanceStatus.DONE;
            tip = '松开刷新';
        } else if (dist > 0){
            this.distanceStatus = DistanceStatus.HALF;
            tip = '下拉刷新';
        }
        return tip;
    }

    getUpdateStatus(): Status {
        if (this.distanceStatus === DistanceStatus.DONE) {
            return 'update';
        }
        if (this.distanceStatus === DistanceStatus.HALF) {
            return 'reset';
        }
        return 'none';
    }

}

export default ScrollControl;