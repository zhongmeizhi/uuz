import Geometry from "@/geometry";

class Rect extends Geometry {
  constructor({ core, style, events } = {}) {
    super(core, style, events);
  }

  render(ctx) {
    this.paint(
      ctx,
      () => {
        const geometry = new Path2D();
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

export default Rect;
