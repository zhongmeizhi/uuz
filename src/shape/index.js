import EventDispatcher from "@/utils/eventDispatcher.js";
import { isFn, errorHandler } from "@/utils/base.js";

class Shape extends EventDispatcher {
  constructor({ core = {}, style = {}, events, animate }) {
    super();
    this.core = this._setTrace(core);
    this.style = this._setTrace(style);
    this.events = events;
    this.animate = animate;
    this.path = [];
    this.dirty = false;
    // this.oldData = {}
    this.fillAble = false;
    this.strokeAble = false;
  }

  adjustDrawStrategy() {
    const { background, border } = this.style;
    if (background && background !== "none") {
      this.fillAble = true;
    }
    if (border && border !== "none") {
      this.strokeAble = true;
    }
  }

  createPath() {
    errorHandler("render 需要被重写");
  }

  isPointInPath() {
    errorHandler("isPointInPath 需要被重写");
  }

  /**
   * @param  {String} eventName
   * @param  {MouseEvent} event
   */
  eventHandler(eventName, event) {
    isFn(this.events[eventName]) && this.events[eventName](this, event);
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
        Reflect.set(target, prop, value);
        if (!this.dirty) {
          this.dirty = true;
          this.dispatch("update", this);
        }
        return true;
      },
    });
  }
}

export default Shape;
