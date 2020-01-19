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
    Prevent_Distance: number;

    constructor({curIdx = 0, direction = 'x', len, justifyDistance = 77}: SwiperMasterProps) {
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
    }

    setSwiperRange(range: number) {
        // 可能横竖屏 或者 使用者改变 Swiper大小
        // 所以宽高是动态获取的
        this.swiperRange = range;
    }

    getIndex(): number {
        return this.curIdx;
    }

    _justifyAxis(): Point {
        const distance = this.distance[this.direction];
        if (distance > this.justifyDistance) {
            if (this.curIdx < this.len - 2) {
                this.curIdx++;
                this.endPoint[this.direction] -= this.swiperRange;
            }
        } else if (distance < this.justifyDistance) {
            if (this.curIdx > 0) {
                this.curIdx--;
                this.endPoint[this.direction] += this.swiperRange;
            }
        }
        return this.endPoint;
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
        this.distance =  {
            x: this.startPoint.x - point.pageX,
            y: this.startPoint.y - point.pageY,
        }
        // TODO 方向锁定
        // const isCockX = this.distance.y > this.Prevent_Distance;
        // const isCockY = this.distance.x > this.Prevent_Distance;
        // if (isCockX || isCockY) {
        //     event.preventDefault();
        // }
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
