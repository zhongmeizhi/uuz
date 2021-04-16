import { isFn, errorHandler } from "@/utils/base.js";

class EventDispatcher {
  constructor() {
    this._listeners = {};
  }

  /**
   * @param  {String} name
   * @param  {Function} fn
   */
  addListener(name, fn) {
    if (!isFn(fn)) return errorHandler("监听对象不是一个函数");
    if (!this._listeners[name]) {
      this._listeners[name] = new Set();
    }
    this._listeners[name].add(fn);
  }

  /**
   * @param  {String name
   */
  dispatch(name, argv) {
    if (this._listeners[name]) {
      this._listeners[name].forEach((fn) => fn.call(this, argv));
    }
  }

  /**
   * @param  {String} name
   * @param  {Function} fn
   */
  removeListener(name, fn) {
    if (!this._listeners[name]) return;
    if (this._listeners[name] && fn) {
      this._listeners[name].delete(fn);
    } else {
      delete this._listeners[name];
    }
  }
}

export default EventDispatcher;
