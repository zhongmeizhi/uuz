(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.uuz = factory());
}(this, (function () { 'use strict';

  class Renderer {
    /**
     * @param  {string} eleSelector
     */
    constructor(eleSelector) {
      const ele = document.querySelector(eleSelector);

      if (!ele) {
        throw new Error("不能找到匹配的dom元素");
      }

      this.ctx = ele.getContext("2d");
      this.element = ele;
      this.sceneSet = new Set();

      this._antiAliasing(ele);
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    /**
     * @param  {Scene} scene
     */
    // TODO: 多个场景


    render(scene) {
      this.sceneSet.add(scene);
      this.sceneSet.forEach(scene => scene.init.call(scene, this));
      this.forceUpdate();

      this._initAnimation();
    }

    update() {
      this.sceneSet.forEach(scene => {
        if (scene.dirtySet.size) {
          scene.update();
        }
      });
    }

    forceUpdate() {
      this.clear();
      this.sceneSet.forEach(scene => {
        scene.dirtySet.forEach(item => {
          item.drawPath();
          item.dirty = false;
        });
        scene.dirtySet.clear();
        scene.shapePools.forEach(shape => {
          this.ctx.save();
          this.ctx.beginPath();
          shape.setStyles(this.ctx);
          shape.path.forEach(({
            type,
            args
          }) => {
            this.ctx[type](...args);
          });
          this.ctx.stroke();
          this.ctx.fill();
          this.ctx.restore();
        });
      });
    }
    /**
     * 抗锯齿
     * @param  {HTMLElement} ele
     */


    _antiAliasing(ele) {
      this.dpr = window.devicePixelRatio || 1;
      this.width = ele.width;
      this.height = ele.height;
      ele.style.width = this.width + "px";
      ele.style.height = this.height + "px";
      ele.width = this.width * this.dpr;
      ele.height = this.height * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);
      this.ctx.save();
    }

    _initAnimation() {
      const run = () => {
        this.sceneSet.forEach(scene => scene.animate());
        this.forceUpdate();
        window.requestAnimationFrame(run);
      };

      window.requestAnimationFrame(run);
    }

  }

  /**
   * @param  {Shape} shape
   * @param  {number} max_objects=10
   * @param  {number} max_levels=4
   * @param  {number} level=0
   */
  class Mesh {
    constructor(pRect, max_objects = 10, max_levels = 4, level = 0) {
      this.max_objects = max_objects;
      this.max_levels = max_levels;
      this.level = level;
      this.bounds = pRect;
      this.objects = [];
      this.nodes = [];
    }
    /**
     * @param  {} shape
     */


    insert(shape) {
      let i = 0,
          indexes;

      if (this.nodes.length) {
        indexes = this._getIndex(shape);

        for (i = 0; i < indexes.length; i++) {
          this.nodes[indexes[i]].insert(shape);
        }

        return;
      }

      shape.parentBound = this.objects;
      this.objects.push(shape);

      if (this.objects.length > this.max_objects && this.level < this.max_levels) {
        if (!this.nodes.length) {
          this._splitMesh();
        }

        for (i = 0; i < this.objects.length; i++) {
          indexes = this._getIndex(this.objects[i]);

          for (let k = 0; k < indexes.length; k++) {
            this.nodes[indexes[k]].insert(this.objects[i]);
          }
        }

        this.objects = [];
      }
    }
    /**
     * @param  {} shape
     */


    retrieve(shape) {
      let indexes = this._getIndex(shape),
          returnObjects = this.objects;

      if (this.nodes.length) {
        for (let i = 0; i < indexes.length; i++) {
          returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(shape));
        }
      } // 筛选，感觉算法可以优化


      returnObjects = returnObjects.filter(function (item, index) {
        return returnObjects.indexOf(item) >= index;
      });
      return returnObjects;
    }
    /**
     * @param  {number} mouseX
     * @param  {number} mouseY
     * @param  {number} blur
     */


    queryMouse(mouseX, mouseY, blur = 4) {
      return this.retrieve({
        x: mouseX,
        y: mouseY,
        width: blur,
        height: blur
      });
    }

    clear() {
      this.objects = [];

      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes.length) {
          this.nodes[i].clear();
        }
      }

      this.nodes = [];
    }
    /**
     * @param  {} shape
     */


    update(shape) {
      if (shape.parentBound) {
        const idx = shape.parentBound.findIndex(item => item === shape);
        shape.parentBound.splice(idx, 1);
        delete shape.parentBound;
        const root = this.findRoot();
        root.insert(shape);
      }
    }

    findRoot() {
      let mesh = this;

      while (mesh.parentMesh) {
        mesh = mesh.parentMesh;
      }

      return mesh;
    }

    _getBoundAttr(bound) {
      let attr = bound.core || bound;
      let result = { ...attr
      };

      if (result.radius) {
        const diameter = result.radius * 2;
        result.width = diameter;
        result.height = diameter;
      }

      return result;
    }

    _splitMesh() {
      let nextLevel = this.level + 1;

      const {
        x,
        y,
        width,
        height
      } = this._getBoundAttr(this.bounds);

      let subWidth = width / 2;
      let subHeight = height / 2;
      const axis = [{
        x: x + subWidth,
        y: y
      }, {
        x: x,
        y: y
      }, {
        x: x,
        y: y + subHeight
      }, {
        x: x + subWidth,
        y: y + subHeight
      }];
      axis.forEach(({
        x,
        y
      }) => {
        const mesh = new Mesh({
          x,
          y,
          width: subWidth,
          height: subHeight
        }, this.max_objects, this.max_levels, nextLevel);
        mesh.parentMesh = this;
        this.nodes.push(mesh);
      });
    }
    /**
     * @param {Shape} shape
     * @return {number[]} 
     */


    _getIndex(shape) {
      const {
        x,
        y,
        width,
        height
      } = this._getBoundAttr(shape);

      let indexes = [],
          verticalMidpoint = this.bounds.x + this.bounds.width / 2,
          horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
      let startIsNorth = y < horizontalMidpoint,
          startIsWest = x < verticalMidpoint,
          endIsEast = x + width > verticalMidpoint,
          endIsSouth = y + height > horizontalMidpoint;

      if (startIsNorth && endIsEast) {
        indexes.push(0);
      }

      if (startIsWest && startIsNorth) {
        indexes.push(1);
      }

      if (startIsWest && endIsSouth) {
        indexes.push(2);
      }

      if (endIsEast && endIsSouth) {
        indexes.push(3);
      }

      return indexes;
    }

  }

  // export const isStr = (v) => typeof v === 'string';
  function isFn(fn) {
    return typeof fn === "function";
  }
  function errorHandler(msg) {
    throw new Error(msg);
  }

  class Scene {
    /**
     * @param  {} {core
     * @param  {} style}={}
     */
    constructor({
      core,
      style
    } = {}) {
      // TODO: 添加 Scene 的样式
      this.dirtySet = new Set();
      this.shapePools = new Set();
      this.animateSet = new Set();
    }
    /**
     * @param  {Shape} shape
     */


    add(shape) {
      this.shapePools.add(shape);
      this.dirtySet.add(shape);
    }

    init(renderer) {
      const {
        width,
        height,
        element,
        ctx
      } = renderer;
      this.ctx = ctx;

      this._initMesh(width, height);

      this._appendShape(renderer);

      this._initEvents(element);
    } // TODO: 开启局部更新


    update() {
      this.dirtySet.forEach(item => {
        this.clip(item);
        item.render();
      });
      this.dirtySet.clear();
    }

    animate() {
      this.animateSet.forEach(anm => anm());
    } // TODO: 根据网格动态裁剪


    clip(item) {// ctx.clip();
    }
    /**
     * @param  {number} width
     * @param  {number} height
     */


    _initMesh(width, height) {
      this.mesh = new Mesh({
        x: 0,
        y: 0,
        width,
        height
      });
    }
    /**
     * @param  {Renderer} renderer
     */


    _appendShape(renderer) {
      this.shapePools.forEach(shape => {
        shape.init(renderer);

        if (shape.events && Object.keys(shape.events).length) {
          this.mesh.insert(shape);
        }

        if (isFn(shape.animate)) {
          this.animateSet.add(() => {
            shape.animate.call(shape, shape);
          });
        }

        shape.addListener("update", () => {
          this.mesh.update(shape);
          this.dirtySet.add(shape);
        });
        shape.addListener("remove", shape => {
          this.shapePools.delete(shape);
          this.mesh.remove(shape);
        });
      });
    }
    /**
     * @param  {HtmlElement} element
     */


    _initEvents(element) {
      ["click", "mousemove"].forEach(eventName => {
        element.addEventListener(eventName, event => {
          const broadPhaseResult = this.mesh.queryMouse(event.offsetX, event.offsetY);
          broadPhaseResult.forEach(shape => {
            shape.eventHandler(eventName, event);
          });
        });
      });
    }

  }

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
        this._listeners[name].forEach(fn => fn.call(this, argv));
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

  class Shape extends EventDispatcher {
    constructor({
      core = {},
      style = {},
      events,
      animate
    }) {
      super();
      this.core = this._setTrace(core);
      this.style = this._setTrace(style);
      this.events = events;
      this.animate = animate; // this.path = new Path2D();

      this.path = [];
      this.dirty = false;
      this.isEnter = false; // this.oldData = {}
    }
    /**
     * @param  {Renderer} renderer
     */


    init(renderer) {
      const {
        dpr
      } = renderer;
      this.dpr = dpr;
    } // TODO: 需要性能优化


    setStyles(ctx) {
      for (let k of Object.keys(this.style)) {
        const exec = styleMap[k];

        if (exec) {
          exec(ctx, this.style[k]);
        }
      }
    }

    drawPath() {
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
        }
      });
    }
    /**
     * ps: 抗锯齿和 isPointInPath 需要校验点击位置
     * @param  {MouseEvent} event
     */
    // TODO: 优化路径校验


    _isPointInPath(event) {
      return true; // return this.ctx.isPointInPath(
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

  class Rect extends Shape {
    constructor(args) {
      super(args);
    }

    _createRectPath(x, y, width, height, radius) {
      this.path.push({
        type: "moveTo",
        args: [x + radius, y]
      });
      this.path.push({
        type: "arcTo",
        args: [x + width, y, x + width, y + radius, radius]
      });
      this.path.push({
        type: "arcTo",
        args: [x + width, y + height, x + width - radius, y + height, radius]
      });
      this.path.push({
        type: "arcTo",
        args: [x, y + height, x, y + height - radius, radius]
      });
      this.path.push({
        type: "arcTo",
        args: [x, y, x + radius, y, radius]
      });
    }

    drawPath() {
      this.path = [];
      const {
        x,
        y,
        width,
        height
      } = this.core;
      const radius = this.style.borderRadius || 0;

      this._createRectPath(x, y, width, height, radius);
    }

  }

  class Rect$1 extends Shape {
    constructor(args) {
      super(args);
    }

    _createRectPath(x, y, width, height, radius) {
      this.path.push({
        type: "moveTo",
        args: [x + radius, y]
      });
      this.path.push({
        type: "arcTo",
        args: [x + width, y, x + width, y + radius, radius]
      });
      this.path.push({
        type: "arcTo",
        args: [x + width, y + height, x + width - radius, y + height, radius]
      });
      this.path.push({
        type: "arcTo",
        args: [x, y + height, x, y + height - radius, radius]
      });
      this.path.push({
        type: "arcTo",
        args: [x, y, x + radius, y, radius]
      });
    }

    drawPath() {
      this.path = [];
      const {
        x,
        y,
        width,
        height
      } = this.core;
      const radius = this.style.borderRadius || 0;

      this._createRectPath(x, y, width, height, radius);
    }

  }

  class Arc extends Rect$1 {
    constructor(args) {
      super(args);
    }

    drawPath() {
      this.path = [];
      const {
        x,
        y,
        radius
      } = this.core;
      const width = radius * 2;
      const height = width;
      this.path.push({
        type: 'moveTo',
        args: [x + radius, y]
      });
      this.path.push({
        type: 'arcTo',
        args: [x + width, y, x + width, y + radius, radius]
      });
      this.path.push({
        type: 'arcTo',
        args: [x + width, y + height, x + width - radius, y + height, radius]
      });
      this.path.push({
        type: 'arcTo',
        args: [x, y + height, x, y + height - radius, radius]
      });
      this.path.push({
        type: 'arcTo',
        args: [x, y, x + radius, y, radius]
      });
    }

  }

  class Group {}

  const uuz = {
    Renderer,
    Scene,
    Rect,
    Arc,
    Group
  };

  return uuz;

})));
