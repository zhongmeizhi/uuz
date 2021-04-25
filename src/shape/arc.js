import Rect from "@/shape/rect.js";

class Arc extends Rect {
  constructor(args) {
    super(args);
  }

  createPath() {
    this.path = [];
    const { x, y, radius } = this.core;
    const width = radius * 2;
    const height = width;
    this._pushRectPath(x, y, width, height, radius);
  }
}

export default Arc;
