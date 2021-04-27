class Renderer {

  /**
   * @param  {string} target
   * @param  {boolean} dynamic
   * @param  {boolean} hd
   */
  constructor({ target, dynamic = true, hd = true }) {
    const ele = document.querySelector(target);
    if (!ele) {
      throw new Error("不能找到匹配的dom元素");
    }
    this.element = ele;
    this.ctx = ele.getContext("2d");
    this.width = ele.width;
    this.height = ele.height;
    this.dpr = 1;
    this.dynamic = dynamic;
    this.hd = hd;
    this.scene = null;
    hd && this._initHd(ele);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * @param  {Scene} scene
   */
  render(scene) {
    this.scene = scene;
    scene.init.call(scene, this);
    this.forceUpdate();
    this.dynamic && this.initAnimation();
  }

  update() {
    if (this.scene.dirtySet.size) {
      this.scene.update();
    }
  }

  forceUpdate() {
    this.clear();
    const scene = this.scene;
    scene.update();
    scene.shapePools.forEach((shape) => {
      this.ctx.save();
      this.ctx.beginPath();
      this._drawStyle(shape.style);
      this._drawPath(shape.path);
      this.ctx.closePath();
      if (shape.strokeAble) {
        this.ctx.stroke();
      }
      if (shape.fillAble) {
        this.ctx.fill();
      }
      this.ctx.restore();
    });
  }

  initAnimation() {
    const run = () => {
      this.scene.animate();
      this.forceUpdate();
      window.requestAnimationFrame(run);
    };
    window.requestAnimationFrame(run);
  }

  /**
   * 抗锯齿
   * @param  {HTMLElement} ele
   */
  _initHd(ele) {
    this.dpr = window.devicePixelRatio;
    ele.style.width = this.width + "px";
    ele.style.height = this.height + "px";
    ele.width = this.width * this.dpr;
    ele.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.save();
  }

  _drawStyle(style) {
    const ctx = this.ctx;
    for (let k of Object.keys(style)) {
      const val = style[k];
      if (val === 'none') {
        continue;
      }
      switch (k) {
        case "background":
          ctx.fillStyle = val;
          break;
        case "opacity":
          ctx.globalAlpha = val;
          break;
        case "boxShadow":
          const [shadowColor, x, y, blur] = val.split(" ");
          if (shadowColor && x && y && blur) {
            ctx.shadowColor = shadowColor;
            ctx.shadowOffsetX = x;
            ctx.shadowOffsetY = y;
            ctx.shadowBlur = blur;
          }
          break;
        case "zIndex":
          if (val > 0) {
            ctx.globalCompositeOperation = "source-over";
          } else {
            ctx.globalCompositeOperation = "destination-over";
          }
          break;
        case "border":
          const [width, solid, color] = val.split(" ");
          if (width && solid && color) {
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
          }
          break;
        default:
          break;
      }
    }
  }

  _drawPath(path) {
    path.forEach(({ type, args }) => {
      this.ctx[type](...args);
    });
  }
}

export default Renderer;
