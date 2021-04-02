import Geometry from "@/geometry";

class Arc extends Geometry {
  constructor({ core, style, events } = {}) {
    super(core, style, events);
  }

  render(ctx) {
    this.paint(
      ctx,
      () => {
        const geometry = new Path2D();
        geometry.arc(
          this.core.x,
          this.core.y,
          this.core.radius,
          0,
          2 * Math.PI
          // this.core.startAngle,
          // this.core.endAngle,
          // this.core.counterclockwise
        )
        return geometry;
      }
    );
  }
}

export default Arc;
