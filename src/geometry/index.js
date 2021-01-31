import styleMap from "./styleMap.js";

class Geometry {
  constructor(core = {}, style = {}, events = {}) {
    this.core = core;
    this.style = style;
    this.events = events;
    this.geometry = null;
  }

  // TODO: 需要性能优化
  setStyles() {
    for (let k of Object.keys(this.style)) {
      const exec = styleMap[k];
      if (exec) {
        exec(this.scene.renderer.ctx, this.style[k]);
      }
    }
  }

  // 抗锯齿和 isPointInPath 需要校验点击位置
  clickHandler(event) {
    if (
      this.scene.renderer.ctx.isPointInPath(
        this.geometry,
        event.offsetX * this.scene.dpr,
        event.offsetY * this.scene.dpr
      )
    ) {
      this.events.click(this, event);
    }
  }

  paint(render) {
    const ctx = this.scene.renderer.ctx;
    if (ctx && typeof render === "function") {
      ctx.save();
      ctx.beginPath();
      this.setStyles();
      this.geometry = render();
      ctx.fill(this.geometry);
      ctx.closePath();
      ctx.restore();
    }
  }

  trace() {
    const traceList = ['core', 'style', 'events'];
    traceList.forEach(str => {
      this[str] = new Proxy(this[str], {
        set: (target, prop, value) => {
          target[prop] = value;
          this.scene.renderer.updateList.push(this)
          return true;
        }
      })
    })
  }

  inject(scene) {
    this.scene = scene;
    this.trace();
  }
}

export default Geometry;
