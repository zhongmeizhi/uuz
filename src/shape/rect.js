import Shape from "@/shape";
import { isArr, isNumber } from "@/utils/base.js";

class Rect extends Shape {
  constructor(args) {
    super(args);
  }

  _buildPath(x, y, width, height, r) {
    var r1;
    var r2;
    var r3;
    var r4;
    if (width < 0) {
      x = x + width;
      width = -width;
    }
    if (height < 0) {
      y = y + height;
      height = -height;
    }
    if (isNumber(r)) {
      r1 = r2 = r3 = r4 = r;
    } else if (isArr(r)) {
      if (r.length === 1) {
        r1 = r2 = r3 = r4 = r[0];
      } else if (r.length === 2) {
        r1 = r3 = r[0];
        r2 = r4 = r[1];
      } else if (r.length === 3) {
        r1 = r[0];
        r2 = r4 = r[1];
        r3 = r[2];
      } else {
        r1 = r[0];
        r2 = r[1];
        r3 = r[2];
        r4 = r[3];
      }
    } else {
      r1 = r2 = r3 = r4 = 0;
    }
    var total;
    if (r1 + r2 > width) {
      total = r1 + r2;
      r1 *= width / total;
      r2 *= width / total;
    }
    if (r3 + r4 > width) {
      total = r3 + r4;
      r3 *= width / total;
      r4 *= width / total;
    }
    if (r2 + r3 > height) {
      total = r2 + r3;
      r2 *= height / total;
      r3 *= height / total;
    }
    if (r1 + r4 > height) {
      total = r1 + r4;
      r1 *= height / total;
      r4 *= height / total;
    }
    this.path.push({
      type: "moveTo",
      args: [x + r1, y],
    });
    this.path.push({
      type: "arcTo",
      args: [x + width, y, x + width, y + r2, r2],
    });
    this.path.push({
      type: "arcTo",
      args: [x + width, y + height, x + width - r3, y + height, r3],
    });
    this.path.push({
      type: "arcTo",
      args: [x, y + height, x, y + height - r4, r4],
    });
    this.path.push({
      type: "arcTo",
      args: [x, y, x + r1, y, r1],
    });
    // TODO: 需要 benchmark 2中绘制方法性能差异
    // this.path.push({
    //   type: "moveTo",
    //   args: [x + r1, y],
    // });
    // this.path.push({
    //   type: "lineTo",
    //   args: [x + width - r2, y],
    // });
    // r2 !== 0 && this.path.push({
    //   type: "arc",
    //   args: [x + width - r2, y + r2, r2, -Math.PI / 2, 0],
    // });
    // this.path.push({
    //   type: "lineTo",
    //   args: [x + width, y + height - r3],
    // });
    // r3 !== 0 && this.path.push({
    //   type: "arc",
    //   args: [x + width - r3, y + height - r3, r3, 0, Math.PI / 2],
    // });
    // this.path.push({
    //   type: "lineTo",
    //   args: [x + r4, y + height],
    // });
    // r4 !== 0 && this.path.push({
    //   type: "arc",
    //   args: [x + r4, y + height - r4, r4, Math.PI / 2, Math.PI],
    // });
    // this.path.push({
    //   type: "lineTo",
    //   args: [x, y + r1],
    // });
    // r1 !== 0 && this.path.push({
    //   type: "arc",
    //   args: [x + r1, y + r1, r1, Math.PI, Math.PI * 1.5],
    // });
  }

  createPath() {
    this.path = [];
    const { x, y, width, height } = this.core;
    const radius = this.style.borderRadius || 0;
    this._buildPath(x, y, width, height, radius);
  }
}

export default Rect;
