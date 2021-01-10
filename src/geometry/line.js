import Geometry from "@/geometry";

class Line extends Geometry {
  constructor({ core, style } = {}) {
    super(core, style);
  }

  render() {
    const geometry = new Path2D();
    this.paint(
      ctx,
      () => {
        geometry.rect(
          this.core.x,
          this.core.y,
          this.core.width,
          this.core.height
        )
        return geometry;
      }
    );
  }
}

export default Line;
