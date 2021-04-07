import styleMap from "./styleMap.js";
import content from "@/content";

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

  clickHandler(event) {
    this.events.click(this, event)
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

  inject(scene) {
    this.scene = scene;
  }
}

export default Geometry;
