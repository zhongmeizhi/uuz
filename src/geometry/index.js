import styleMap from "./styleMap.js";
import content from "@/content";

class Geometry {
  constructor(core = {}, style = {}, events = {}) {
    this.core = core;
    this.style = style;
    this.events = events;
    this.geometry = null;
    this.isInitEvent = false;
  }

  setEventHandler() {
    if (this.isInitEvent) return;
    if (typeof this.events !== "object") return;
    for (let k of Object.keys(this.events)) {
      content.pushEvent(k, {
        geometry: this.geometry,
        event: this.events[k].bind(this),
      });
    }
    this.isInitEvent = true;
  }
  
  /**
   * @param  {} ctx
   */
  setStyles(ctx) {
    for (let k of Object.keys(this.style)) {
      const exec = styleMap[k];
      if (exec) {
        exec(ctx, this.style[k]);
      }
    }
  }

  paint(ctx, render) {
    if (ctx && typeof render === "function") {
      ctx.save();
      ctx.beginPath();
      this.setStyles(ctx);
      this.geometry = render();
      this.setEventHandler();
      ctx.fill(this.geometry);
      ctx.closePath();
      ctx.restore();
    }
  }

  mount(scene) {
    this.scene = scene;
  }

  update() {

  }

  // TODO: 等diff完成
  destroy() {
  }
}

export default Geometry;
