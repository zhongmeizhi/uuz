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

    this._antiAliasing(ele);
  }
  /**
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

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  /**
   * @param  {Scene} scene
   */


  render(scene) {
    scene.dispatch("mounting", this);
    scene.dispatch("mounted");
    this.scene = scene;
    this.update();
    return this;
  }

  update() {
    this.clear();
    this.scene.forceUpdate(); // TODO: 部分更新
    // if (this.scene.dirtySet.size) {
    //   console.log('更新')
    //   this.scene.update();
    // }
  }
  /**
   * @param  {Function} callback
   */


  animation(callback) {
    const run = () => {
      if (typeof callback === "function") {
        callback.call(null, this);
      }

      this.update();
      window.requestAnimationFrame(run);
    };

    window.requestAnimationFrame(run);
  }

}

// import {errorHandler} from '@/utils/base.js'

/**
 * @param  {Geometry} geometry
 * @param  {number} max_objects=10
 * @param  {number} max_levels=4
 * @param  {number} level=0
 */
class Mesh {
  constructor(geometry, max_objects = 10, max_levels = 4, level = 0) {
    this.max_objects = max_objects;
    this.max_levels = max_levels;
    this.level = level;
    this.bounds = geometry;
    this.objects = [];
    this.nodes = [];
  }

  _split() {
    var nextLevel = this.level + 1,
        subWidth = this.bounds.width / 2,
        subHeight = this.bounds.height / 2,
        x = this.bounds.x,
        y = this.bounds.y; //top right node

    this.nodes[0] = new Mesh({
      x: x + subWidth,
      y: y,
      width: subWidth,
      height: subHeight
    }, this.max_objects, this.max_levels, nextLevel); //top left node

    this.nodes[1] = new Mesh({
      x: x,
      y: y,
      width: subWidth,
      height: subHeight
    }, this.max_objects, this.max_levels, nextLevel); //bottom left node

    this.nodes[2] = new Mesh({
      x: x,
      y: y + subHeight,
      width: subWidth,
      height: subHeight
    }, this.max_objects, this.max_levels, nextLevel); //bottom right node

    this.nodes[3] = new Mesh({
      x: x + subWidth,
      y: y + subHeight,
      width: subWidth,
      height: subHeight
    }, this.max_objects, this.max_levels, nextLevel);
  }
  /**
   * Determine which node the object belongs to
   * @param {Rect} pRect      bounds of the area to be checked ({ x, y, width, height })
   * @return {number[]}       an array of indexes of the intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
   */


  _getIndex(pRect) {
    var indexes = [],
        verticalMidpoint = this.bounds.x + this.bounds.width / 2,
        horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
    var startIsNorth = pRect.y < horizontalMidpoint,
        startIsWest = pRect.x < verticalMidpoint,
        endIsEast = pRect.x + pRect.width > verticalMidpoint,
        endIsSouth = pRect.y + pRect.height > horizontalMidpoint; //top-right quad

    if (startIsNorth && endIsEast) {
      indexes.push(0);
    } //top-left quad


    if (startIsWest && startIsNorth) {
      indexes.push(1);
    } //bottom-left quad


    if (startIsWest && endIsSouth) {
      indexes.push(2);
    } //bottom-right quad


    if (endIsEast && endIsSouth) {
      indexes.push(3);
    }

    return indexes;
  }
  /**
   * @param  {} pRect
   */


  insert(pRect) {
    var i = 0,
        indexes; //if we have subnodes, call insert on matching subnodes

    if (this.nodes.length) {
      indexes = this._getIndex(pRect);

      for (i = 0; i < indexes.length; i++) {
        this.nodes[indexes[i]].insert(pRect);
      }

      return;
    } //otherwise, store object here


    this.objects.push(pRect); //max_objects reached

    if (this.objects.length > this.max_objects && this.level < this.max_levels) {
      //split if we don't already have subnodes
      if (!this.nodes.length) {
        this._split();
      } //add all objects to their corresponding subnode


      for (i = 0; i < this.objects.length; i++) {
        indexes = this._getIndex(this.objects[i]);

        for (var k = 0; k < indexes.length; k++) {
          this.nodes[indexes[k]].insert(this.objects[i]);
        }
      } //clean up this node


      this.objects = [];
    }
  }
  /**
   * @param  {} pRect
   */


  retrieve(pRect) {
    var indexes = this._getIndex(pRect),
        returnObjects = this.objects; //if we have subnodes, retrieve their objects


    if (this.nodes.length) {
      for (var i = 0; i < indexes.length; i++) {
        returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(pRect));
      }
    } //remove duplicates


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

    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes.length) {
        this.nodes[i].clear();
      }
    }

    this.nodes = [];
  }

}

// export const isStr = (v) => typeof v === 'string';
// export const isObject = (val) => val !== null && typeof val === 'object';
const isArr = Array.isArray;
function isFn(fn) {
  return typeof fn === "function";
}
function errorHandler(msg) {
  throw new Error(msg);
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

class Scene extends EventDispatcher {
  /**
   * @param  {} {core
   * @param  {} style}={}
   */
  constructor({
    core,
    style
  } = {}) {
    super(); // TODO: 添加 Scene 的样式

    this.dirtySet = new Set();
    this.newGeometryPool = [];

    this._init();
  }

  _init() {
    this.addListener("mounting", this._mounting);
    this.addListener("mounted", this._mounted);
  }

  _mounting(renderer) {
    const {
      width,
      height
    } = renderer;
    this.renderer = renderer;
    this.mesh = new Mesh({
      x: 0,
      y: 0,
      width,
      height
    });
  }

  _mounted() {
    this.newGeometryPool.forEach(geometry => {
      geometry.dispatch("mounting", this);
      geometry.dispatch("mounted", this);
      this.mesh.insert(geometry);
      this.dirtySet.add(geometry);
    });

    this._initEvents(this.renderer);
  }

  _initEvents(renderer) {
    ["click", "mousemove"].forEach(eventName => {
      renderer.element.addEventListener(eventName, event => {
        const broadPhaseResult = this.mesh.queryMouse(event.offsetX, event.offsetY);
        broadPhaseResult.forEach(geometry => {
          geometry.eventHandler(eventName, event);
        });
      });
    });
  }
  /**
   * @param  {Geometry} geometry
   */


  add(geometry) {
    // geometry.attach(this);
    this.newGeometryPool.push(geometry);
  } // TODO: 开启局部更新


  update() {
    this.dirtySet.forEach(item => {
      this.clip(item);
      item.render();
    });
    this.dirtySet.clear();
  }

  forceUpdate() {
    this._traverseMesh(this.mesh); // (node) => {
    //   this.add(
    //     new Rect({
    //       core: node.bounds,
    //       style: { border: "1px solid #008000" },
    //     })
    //   );
    // },

  }
  /**
   * @param  {Mesh} mesh={}
   */


  _traverseMesh(mesh = {}) {
    if (isArr(mesh.nodes) && mesh.nodes.length) {
      mesh.nodes.forEach(node => this._traverseMesh(node));
    } else if (isArr(mesh.objects)) {
      mesh.objects.forEach(geometry => geometry.render());
    }
  } // TODO: 根据网格动态裁剪


  clip(item) {
    console.log(item, "item"); // ctx.clip();
  } // TODO:


  remove(geometry) {}

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
  } // border(ctx, val) {
  //   const [width, solid, color] = val.split(" ");
  //   ctx.strokeStyle = color;
  // }


};

class Geometry extends EventDispatcher {
  constructor(core = {}, style = {}, events = {}) {
    super();
    this.core = core;
    this.style = style;
    this.events = events;
    this.scene = null;
    this.path = null;
    this.dirty = false;
    this.isEnter = false; // this.oldData = {}

    this._init();
  }

  _init() {
    this.addListener("mounting", this._mounting);
    this.addListener("mounted", this._mounted);
  }

  _mounting(scene) {
    const {
      ctx,
      dpr
    } = scene.renderer;
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
      }
    });
  } // TODO: 需要性能优化


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
    return this.ctx.isPointInPath(this.path, event.offsetX * this.dpr, event.offsetY * this.dpr);
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
      ctx.fill(this.path); // if (this.style.border) {
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

class Rect extends Geometry {
  constructor({
    core,
    style,
    events
  } = {}) {
    super(core, style, events); // FIXME:

    this.x = core.x;
    this.y = core.y;
    this.width = core.width;
    this.height = core.height;
  }

  render() {
    const geometry = new Path2D();

    this._paint(() => {
      geometry.rect(this.core.x, this.core.y, this.core.width, this.core.height);
      return geometry;
    });
  }

}

class Arc extends Geometry {
  constructor({
    core,
    style,
    events
  } = {}) {
    super(core, style, events); // FIXME:

    this.x = core.x;
    this.y = core.y;
    const diameter = core.radius * 2;
    this.width = diameter;
    this.height = diameter;
  }

  render() {
    const geometry = new Path2D();

    this._paint(() => {
      geometry.arc(this.core.x, this.core.y, this.core.radius, this.core.startAngle || 0, this.core.endAngle || 2 * Math.PI, !!this.core.counterclockwise);
      return geometry;
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

export default uuz;
