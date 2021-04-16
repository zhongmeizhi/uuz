import Geometry from "@/geometry";

class Rect extends Geometry {
  constructor({ core, style, events } = {}) {
    super(core, style, events);
    // FIXME:
    this.x = core.x;
    this.y = core.y;
    this.width = core.width;
    this.height = core.height;
  }

  render() {
    const geometry = new Path2D();
    this._paint(() => {
      geometry.rect(
        this.core.x,
        this.core.y,
        this.core.width,
        this.core.height
      );
      return geometry;
    });
  }
}

export default Rect;
