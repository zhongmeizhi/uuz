import { getEventPoint } from "../utils/base";

type Point = {
    x: number,
    y: number
}

type Direction = 'x' | 'y';

type UseEvent = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>;

interface MoveControlProps {
    direction?: Direction
}

const zeroPoint = JSON.stringify({ x: 0, y: 0 });

class MoveControl {

    startPoint: Point;
    distance: Point;
    endPoint: Point;
    direction: Direction;
    Prevent_Distance: number;
    lockDirection: Direction | null;
    isAnm: boolean;

    constructor({direction = 'x'}: MoveControlProps) {
        this.direction = direction;
        this.startPoint = JSON.parse(zeroPoint);
        this.distance = JSON.parse(zeroPoint);
        this.endPoint = JSON.parse(zeroPoint);
        this.Prevent_Distance = 5;
        this.lockDirection = null;
        this.isAnm = false;
    }

    // 终止时位置调整
    _getFinalEndPonit(): Point {
        throw Error('_getFinalEndPonit 需要被重写');
    }

    // 方向锁定
    _getLockDirection(): Direction | null {
        const absX = Math.abs(this.distance.x);
        const absY = Math.abs(this.distance.y);

        let lockDirection: Direction | null = null;

        if (this.direction === 'x') {
            if (absX >= absY && absX > this.Prevent_Distance) {
                lockDirection = 'x';
            } else if (absY > this.Prevent_Distance) {
                lockDirection = 'y';
            }
        } else {
            if (absY >= absX && absY > this.Prevent_Distance) {
                lockDirection = 'y';
            } else if (absX > this.Prevent_Distance) {
                lockDirection = 'x';
            }
        }
        
        return lockDirection;
    }

    getDist() {
        const dist = this.endPoint[this.direction] - this.distance[this.direction];
        return dist;
    }

    start(event: UseEvent): void {
        event.stopPropagation();
        this.isAnm = true;
        const point = getEventPoint(event);
        this.lockDirection = null;
        this.startPoint = {
            x: point.pageX,
            y: point.pageY
        }
    }

    move(event: UseEvent): Point {
        if (this.isAnm) {
            event.stopPropagation();
            const point = getEventPoint(event);
            this.distance = {
                x: this.startPoint.x - point.pageX,
                y: this.startPoint.y - point.pageY,
            }
            if (!this.lockDirection) {
                // if (event.cancelable) {
                //     event.preventDefault();
                // }
                this.lockDirection = this._getLockDirection();
            } else if (this.direction === this.lockDirection) {
                if (event.cancelable) {
                    event.preventDefault();
                }
                return Object.assign({x: 0, y: 0}, {[this.direction]: this.getDist()})
            }
        }
        // 如果return movePoint 那么位置不变
        return this.endPoint;
    }

    end(): Point {
        this.isAnm = false;
        return this._getFinalEndPonit();
    }

}

export default MoveControl;
