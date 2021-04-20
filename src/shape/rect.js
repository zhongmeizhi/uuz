import Shape from "@/shape";

class Rect extends Shape {
  constructor({ core, style, events } = {}) {
    super(core, style, events);
    // FIXME:
    this.x = core.x;
    this.y = core.y;
    this.width = core.width;
    this.height = core.height;
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
