import MoveControl from './move';

type Point = {
    x: number,
    y: number
}

type Direction = 'x' | 'y';

interface SwiperControlProps {
    curIdx: number,
    direction: Direction,
    len: number,
    justifyDistance?: number,
}

class SwiperControl extends MoveControl {

    swiperRange: number;
    justifyDistance: number;
    len: number;
    curIdx: number;

    constructor({curIdx = 0, direction = 'x', len, justifyDistance = 33}: SwiperControlProps) {
        super({
            direction,
        });
        this.len = len;
        this.curIdx = curIdx;
        this.justifyDistance = justifyDistance;
        this.swiperRange = 0;
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

}

export default SwiperControl;
