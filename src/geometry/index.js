import styleMap from "./styleMap.js";

class Geometry {
  constructor(core = {}, style = {}, events = {}) {
    this.core = this.trace(core);
    this.style = this.trace(style);
    this.events = this.trace(events);
    this.scene = null;
    this.path = null;
    this.dirty = false;
    // this.oldData = {}
  }

  /**
   * @param  {Object} item
   */
  trace(item) {
    return new Proxy(item, {
      set: (target, prop, value) => {
        target[prop] = value;
        if (!this.dirty) {
          this.scene.dirtySet.add(this);
        }
        this.dirty = true;
        return true;
      }
    })
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

  /**
   * ps: 抗锯齿和 isPointInPath 需要校验点击位置
   * @param  {MouseEvent} event
   */
  clickHandler(event) {
    this.events.click(this, event);
  }
  
  paint(render) {
    this.dirty = false;
    const ctx = this.scene.renderer.ctx;
    if (ctx && typeof render === "function") {
      ctx.save();
      ctx.beginPath();
      this.setStyles();
      this.path = render();
      ctx.fill(this.path);
      ctx.closePath();
      ctx.restore();
    }
  }

  inject(scene) {
    this.scene = scene;
  }
}

export default Geometry;
