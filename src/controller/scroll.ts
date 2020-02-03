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

    constructor() {
        super({direction: 'y'});
        this.Refresh_Distance = 90;
        this.isRefreshable = true;
    }

    _getFinalEndPonit(): Point {
        this.distanceStatus = DistanceStatus.EMPTY;
        return {
            x: 0,
            y: 0
        };
    }

    banRefresh() {
        this.isRefreshable = false;
    }

    canRefresh() {
        this.isRefreshable = true;
    }

    markScrollTip(): string {
        let tip = '';
        const dist = this.getDist();
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