import Geometry from "@/geometry";

class Line extends Geometry {
  constructor({ core, style } = {}) {
    super(core, style);
  }

  render(ctx) {
    this.paint(
      ctx,
      ctx.rect.bind(
        ctx,
        this.core.x,
        this.core.y,
        this.core.width,
        this.core.height
      )
    );
  }
}

export default Line;
