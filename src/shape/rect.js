import Shape from "@/shape";

class Rect extends Shape {
  constructor(args) {
    super(args);
  }

  _createRectPath(x, y, width, height, radius) {
    this.path.push({
      type: "moveTo",
      args: [x + radius, y],
    });
    this.path.push({
      type: "arcTo",
      args: [x + width, y, x + width, y + radius, radius],
    });
    this.path.push({
      type: "arcTo",
      args: [x + width, y + height, x + width - radius, y + height, radius],
    });
    this.path.push({
      type: "arcTo",
      args: [x, y + height, x, y + height - radius, radius],
    });
    this.path.push({
      type: "arcTo",
      args: [x, y, x + radius, y, radius],
    });
  }

  drawPath() {
    this.path = [];
    const { x, y, width, height } = this.core;
    const radius = this.style.borderRadius || 0;
    this._createRectPath(x, y, width, height, radius);
  }
}

export default Rect;
