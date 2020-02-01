type Point = {
    x: number,
    y: number
}

type Direction = 'x' | 'y';

type UseEvent = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>;

interface MoveControlProps {
    curIdx: number,
    direction: Direction,
    len: number,
}

class MoveControl {

    startPoint: Point;
    distance: Point;
    endPoint: Point;
    direction: Direction;
    curIdx: number;
    len: number;
    Prevent_Distance: number;
    lockDirection: Direction | null;
    isAnm: boolean;

    constructor({curIdx = 0, direction = 'x', len}: MoveControlProps) {
        this.direction = direction;
        this.curIdx = curIdx;
        this.len = len;
        // 初始值
        const zeroPoint = JSON.stringify({ x: 0, y: 0 });
        // 
        this.startPoint = JSON.parse(zeroPoint);
        this.distance = JSON.parse(zeroPoint);
        this.endPoint = JSON.parse(zeroPoint);
        this.Prevent_Distance = 7;
        this.lockDirection = null;
        this.isAnm = false;
    }

    getIndex(): number {
        return this.curIdx;
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
            if (absX >= absY &&
                absX > this.Prevent_Distance) {
                lockDirection = 'x';
                // event.preventDefault();
            } else if (absY > this.Prevent_Distance) {
                lockDirection = 'y';
            }
        } else {
            if (absY >= absX &&
                absY > this.Prevent_Distance) {
                lockDirection = 'y';
                // event.preventDefault();
            } else if (absX > this.Prevent_Distance) {
                lockDirection = 'x';
            }
        }
        
        return lockDirection;
    }

    getEventPoint(e: UseEvent) {
        let eventPoint: any;
        if (e.type.indexOf('touch') === 0) {
            eventPoint = (e as React.TouchEvent<HTMLDivElement>).touches[0];
        } else {
            eventPoint = (e as React.MouseEvent<HTMLDivElement>);
        }
        return eventPoint;
    }

    start(event: UseEvent): void {
        event.stopPropagation();
        this.isAnm = true;
        const point = this.getEventPoint(event);
        this.lockDirection = null;
        this.startPoint = {
            x: point.pageX,
            y: point.pageY
        }
    }

    move(event: UseEvent): Point {
        if (this.isAnm) {
            event.stopPropagation();
            const point = this.getEventPoint(event);
            this.distance = {
                x: this.startPoint.x - point.pageX,
                y: this.startPoint.y - point.pageY,
            }
            if (!this.lockDirection) {
                event.preventDefault();
                // 获取锁定方向
                this.lockDirection = this._getLockDirection();
            } else if (this.direction === this.lockDirection) {
                // 方向正确
                event.preventDefault();
                const dist = this.endPoint[this.direction] - this.distance[this.direction];
                return Object.assign({x: 0, y: 0}, {[this.direction]: dist})
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
