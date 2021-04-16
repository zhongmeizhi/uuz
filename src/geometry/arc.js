import Geometry from "@/geometry";

class Arc extends Geometry {
  constructor({ core, style, events } = {}) {
    super(core, style, events);
    // FIXME:
    this.x = core.x;
    this.y = core.y;
    const diameter = core.radius * 2;
    this.width = diameter;
    this.height = diameter;
  }

  render() {
    const geometry = new Path2D();
    this._paint(() => {
      geometry.arc(
        this.core.x,
        this.core.y,
        this.core.radius,
        this.core.startAngle || 0,
        this.core.endAngle || 2 * Math.PI,
        !!this.core.counterclockwise
      );
      return geometry;
    });
  }
}

export default Arc;
