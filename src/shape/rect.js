import Shape from "@/shape";

class Rect extends Shape {
  constructor(args) {
    super(args);
  }

  drawPath() {
    const shape = new Path2D();
    shape.rect(
      this.core.x,
      this.core.y,
      this.core.width,
      this.core.height
    );
    return shape;
  }
}

export default Rect;
