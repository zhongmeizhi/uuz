import Rect from "@/shape/rect.js";

class Arc extends Rect {
  constructor(args) {
    super(args);
  }

  drawPath() {
    this.path = [];
    const { x, y, radius } = this.core;
    const width = radius * 2;
    const height = width;
    this.path.push({
      type: 'moveTo',
      args: [x + radius, y]
    });
    this.path.push({
      type: 'arcTo',
      args: [x + width, y, x + width, y + radius, radius]
    });
    this.path.push({
      type: 'arcTo',
      args: [x + width, y + height, x + width - radius, y + height, radius]
    });
    this.path.push({
      type: 'arcTo',
      args: [x, y + height, x, y + height - radius, radius]
    });
    this.path.push({
      type: 'arcTo',
      args: [x, y, x + radius, y, radius]
    });
  }
}

export default Arc;
