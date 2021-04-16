import EventDispatcher from "@/utils/eventDispatcher.js";
import styleMap from "@/geometry/styleMap.js";
import { isFn } from "@/utils/base.js";

class Geometry extends EventDispatcher {
  constructor(core = {}, style = {}, events = {}) {
    super();
    this.core = core;
    this.style = style;
    this.events = events;
    this.scene = null;
    this.path = null;
    this.dirty = false;
    this.isEnter = false;
    // this.oldData = {}
    this._init();
  }

  _init() {
    this.addListener("mounting", this._mounting);
    this.addListener("mounted", this._mounted);
  }

  _mounting(scene) {
    const { ctx, dpr } = scene.renderer;
    this.scene = scene;
    this.ctx = ctx;
    this.dpr = dpr;
    this.core = this._setTrace(this.core);
    this.style = this._setTrace(this.style);
    this.events = this._setTrace(this.events);
    this._setStyles();
  }

  _mounted() {}

  /**
   * @param  {Object} item
   */
  _setTrace(item) {
    return new Proxy(item, {
      set: (target, prop, value) => {
        target[prop] = value;
        if (!this.dirty) {
          this.scene.dirtySet.add(this);
          this.dirty = true;
        }
        return true;
      },
    });
  }

  // TODO: 需要性能优化
  _setStyles() {
    const ctx = this.ctx;
    for (let k of Object.keys(this.style)) {
      const exec = styleMap[k];
      if (exec) {
        exec(ctx, this.style[k]);
      }
    }
  }

  /**
   * ps: 抗锯齿和 isPointInPath 需要校验点击位置
   * @param  {MouseEvent} event
   */
  _isPointInPath(event) {
    return this.ctx.isPointInPath(
      this.path,
      event.offsetX * this.dpr,
      event.offsetY * this.dpr
    );
  }

  /**
   * @param  {String} eventName
   * @param  {MouseEvent} event
   */
  _transformEvent(eventName, event) {
    const isPointInPath = this._isPointInPath(event);
    if (eventName === "click") {
      if (isPointInPath) return "click";
    } else if (eventName === "mousemove") {
      if (!this.isEnter && isPointInPath) {
        this.isEnter = true;
        return "mouseenter";
      } else if (this.isEnter && !isPointInPath) {
        this.isEnter = false;
        return "mouseleave";
      }
    }
    return false;
  }

  /**
   * @param  {String} eventName
   * @param  {MouseEvent} event
   */
  eventHandler(eventName, event) {
    const realName = this._transformEvent(eventName, event);
    isFn(this.events[realName]) && this.events[realName](this, event);
  }

  _paint(render) {
    this.dirty = false;
    const ctx = this.ctx;
    if (ctx && typeof render === "function") {
      // if (!this.style.background && !this.style.border) return;
      ctx.save();
      ctx.beginPath();
      this._setStyles();
      this.path = render();
      ctx.fill(this.path);
      // if (this.style.border) {
      //   ctx.stroke(this.path)
      // }
      // if (this.style.background) {
      //   ctx.fill(this.path);
      // }
      ctx.closePath();
      ctx.restore();
    }
  }
}

export default Geometry;
