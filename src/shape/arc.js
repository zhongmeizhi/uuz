import Shape from "@/shape";

class Arc extends Shape {
  constructor(args) {
    super(args);
    this.defaultEnd = Math.PI * 2;
  }

  createPath() {
    this.path = [];
    const { x, y, radius, start, end } = this.core;
    const realEnd = end || this.defaultEnd;
    const isClose = realEnd === this.defaultEnd;
    !isClose && this.path.push({
      type: "moveTo",
      args: [x, y],
    });
    this.path.push({
      type: "arc",
      args: [x, y, radius, start || 0, realEnd, true],
    });
  }
}

export default Arc;
