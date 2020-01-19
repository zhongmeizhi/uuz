
interface SwiperMasterProps {
    curIdx: number,
    direction: 'x' | 'y',
    len: number,
    justifyDistance?: number,
}

type Point = {
    x: number,
    y: number
}


class SwiperMaster {

    startPoint: Point;
    distance: Point;
    endPoint: Point;
    direction: 'x' | 'y';
    curIdx: number;
    swiperRange: number;
    justifyDistance: number;
    len: number;

    constructor({curIdx = 0, direction = 'x', len, justifyDistance = 77}: SwiperMasterProps) {
        this.direction = direction;
        this.curIdx = curIdx;
        this.justifyDistance = justifyDistance;
        this.len = len;
        // 初始值
        const zeroPoint = JSON.stringify({ x: 0, y: 0 });
        this.startPoint = JSON.parse(zeroPoint);
        this.distance = JSON.parse(zeroPoint);
        this.endPoint = JSON.parse(zeroPoint);
        this.swiperRange = 0;
    }

    setSwiperRange(range: number) {
        // 会出现屏幕变化，所以宽高是动态获取的
        this.swiperRange = range;
    }

    getIndex(): number {
        return this.curIdx;
    }

    _justifyAxis(): Point {
        const distance = this.distance[this.direction];
        if (Math.abs(distance) > this.justifyDistance) {
            if (distance > 0) {
                if (this.curIdx < this.len - 2) {
                    this.curIdx++;
                    this.endPoint[this.direction] -= this.swiperRange;
                }
            } else {
                if (this.curIdx > 0) {
                    this.curIdx--;
                    this.endPoint[this.direction] += this.swiperRange;
                }
            }
        }
        return this.endPoint!;
    }

    _computeMoveDistance(curPintt: React.Touch) {
        this.distance =  {
            x: this.startPoint.x - curPintt.pageX,
            y: this.startPoint.y - curPintt.pageY,
        }
    }

    start(event: React.TouchEvent<HTMLDivElement>) {
        event.stopPropagation();
        const point = event.touches[0];
        this.startPoint = {
            x: point.pageX,
            y: point.pageY
        }
    }

    move(event: React.TouchEvent<HTMLDivElement>): Point {
        event.stopPropagation();
        const point = event.changedTouches[0];
        this._computeMoveDistance(point);
        return {
            x: this.endPoint.x - this.distance.x,
            y: this.endPoint.y - this.distance.y,
        }
    }

    end(event: React.TouchEvent<HTMLDivElement>): Point {
        event.stopPropagation();
        return this._justifyAxis();
    }

}

export default SwiperMaster;
