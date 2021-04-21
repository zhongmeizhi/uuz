import Shape from "@/shape";

class Arc extends Shape {
  constructor(args) {
    super(args);
  }

  drawPath() {
    const shape = new Path2D();
    shape.arc(
      this.core.x,
      this.core.y,
      this.core.radius,
      this.core.startAngle || 0,
      this.core.endAngle || 2 * Math.PI,
      !!this.core.counterclockwise
    );
    return shape;
  }
}

export default Arc;
