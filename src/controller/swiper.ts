type Point = {
    x: number,
    y: number
}

type Direction = 'x' | 'y';

interface SwiperMasterProps {
    curIdx: number,
    direction: Direction,
    len: number,
    justifyDistance?: number,
}

class SwiperMaster {

    startPoint: Point;
    distance: Point;
    endPoint: Point;
    direction: Direction;
    curIdx: number;
    swiperRange: number;
    justifyDistance: number;
    len: number;
    Prevent_Distance: number;
    lockDirection: Direction | null;

    constructor({curIdx = 0, direction = 'x', len, justifyDistance = 33}: SwiperMasterProps) {
        this.direction = direction;
        this.curIdx = curIdx;
        this.justifyDistance = justifyDistance;
        this.len = len;
        // 初始值
        const zeroPoint = JSON.stringify({ x: 0, y: 0 });
        // 
        this.startPoint = JSON.parse(zeroPoint);
        this.distance = JSON.parse(zeroPoint);
        this.endPoint = JSON.parse(zeroPoint);
        this.swiperRange = 0;
        this.Prevent_Distance = 7;
        this.lockDirection = null;
    }

    // 可能横竖屏 或者 使用者改变 Swiper大小
    // 所以宽高是动态获取的
    setSwiperRange(range: number) {
        this.swiperRange = range;
    }

    getIndex(): number {
        return this.curIdx;
    }

    // 终止时位置调整
    _getFinalEndPonit(): Point {
        if (this.direction === this.lockDirection) {
            const distance = this.distance[this.direction];
            if (distance > this.justifyDistance) {
                if (this.curIdx < this.len - 1) {
                    this.curIdx++;
                    this.endPoint[this.direction] -= this.swiperRange;
                }
            } else if (distance < this.justifyDistance) {
                if (this.curIdx > 0) {
                    this.curIdx--;
                    this.endPoint[this.direction] += this.swiperRange;
                }
            }
        }
        return this.endPoint;
    }

    // 方向锁定
    _getLockDirection(event: React.TouchEvent<HTMLDivElement>): Direction | null {
        const absX = Math.abs(this.distance.x);
        const absY = Math.abs(this.distance.y);

        let lockDirection: Direction | null = null;

        if (this.direction === 'x') {
            if (absX >= absY &&
                absX > this.Prevent_Distance) {
                lockDirection = 'x';
                event.nativeEvent.preventDefault();
            } else if (absY > this.Prevent_Distance) {
                lockDirection = 'y';
            }
        } else {
            if (absY >= absX &&
                absY > this.Prevent_Distance) {
                lockDirection = 'y';
                event.nativeEvent.preventDefault();
            } else if (absX > this.Prevent_Distance) {
                lockDirection = 'x';
            }
        }
        
        return lockDirection;
    }

    start(event: React.TouchEvent<HTMLDivElement>): void {
        event.stopPropagation();
        const point = event.touches[0];
        this.lockDirection = null;
        this.startPoint = {
            x: point.pageX,
            y: point.pageY
        }
    }

    move(event: React.TouchEvent<HTMLDivElement>): Point {
        event.stopPropagation();
        const point = event.changedTouches[0];
        this.distance = {
            x: this.startPoint.x - point.pageX,
            y: this.startPoint.y - point.pageY,
        }
        if (!this.lockDirection) {
            // 试图锁定滑动方向
            this.lockDirection = this._getLockDirection(event);
        } else if (this.direction === this.lockDirection) {
            // 方向锁定 且 方向正确
            const dist = this.endPoint[this.direction] - this.distance[this.direction];
            return Object.assign({}, {x: 0, y: 0}, {[this.direction]: dist})
        }
        // 如果return movePoint 那么位置不变
        return this.endPoint;
    }

    end(event: React.TouchEvent<HTMLDivElement>): Point {
        event.stopPropagation();
        return this._getFinalEndPonit();
    }

}

export default SwiperMaster;
