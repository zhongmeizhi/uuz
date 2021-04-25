import EventDispatcher from "@/utils/eventDispatcher.js";
import { isFn, errorHandler } from "@/utils/base.js";

class Shape extends EventDispatcher {
  constructor({ core = {}, style = {}, events, animate }) {
    super();
    this.core = this._setTrace(core);
    this.style = this._setTrace(style);
    this.events = events;
    this.animate = animate;
    // this.path = new Path2D();
    this.path = [];
    this.dirty = false;
    this.isEnter = false;
    // this.oldData = {}
  }

  /**
   * @param  {Renderer} renderer
   */
  init(renderer) {
    const { dpr } = renderer;
    this.dpr = dpr;
  }

  createPath() {
    errorHandler("render 需要被重写");
  }

  /**
   * @param  {String} eventName
   * @param  {MouseEvent} event
   */
  // TODO: 优化事件穿透
  eventHandler(eventName, event) {
    const realName = this._transformEvent(eventName, event);
    isFn(this.events[realName]) && this.events[realName](this, event);
  }

  remove() {
    this.dispatch("remove", this);
  }

  /**
   * @param  {Object} item
   */
  _setTrace(item) {
    return new Proxy(item, {
      set: (target, prop, value) => {
        target[prop] = value;
        if (!this.dirty) {
          this.dirty = true;
          this.dispatch("update", this);
        }
        return true;
      },
    });
  }

  /**
   * ps: 抗锯齿和 isPointInPath 需要校验点击位置
   * @param  {MouseEvent} event
   */
  // TODO: 优化路径校验
  _isPointInPath(event) {
    return true;
    // return this.ctx.isPointInPath(
    //   this.path,
    //   event.offsetX * this.dpr,
    //   event.offsetY * this.dpr
    // );
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
}

export default Shape;
