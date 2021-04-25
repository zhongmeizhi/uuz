import Shape from "@/shape";

class Line extends Shape {
  constructor(args) {
    super(args);
  }

  createPath() {
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

export default Line;
