const styleMap = {
  background(ctx, val) {
    ctx.fillStyle = val;
  },
  opacity(ctx, val) {
    ctx.globalAlpha = val;
  },
  boxShadow(ctx, val) {
    const [color, x, y, blur] = val.split(" ");
    ctx.shadowColor = color;
    ctx.shadowOffsetX = x;
    ctx.shadowOffsetY = y;
    ctx.shadowBlur = blur;
  },
  // TODO: 优化zIndex规则
  zIndex(ctx, val) {
    if (val > 0) {
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.globalCompositeOperation = "destination-over";
    }
  },
  // borderRadius
  border(ctx, val) {
    const [width, solid, color] = val.split(" ");
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
  }
};

export default styleMap;
