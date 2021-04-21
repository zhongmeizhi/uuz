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


  render(scene) {
    this.sceneSet.add(scene);

    this._draw();

    this._initAnimation();
  }

  update() {
    // TODO: 部分更新
    this.sceneSet.forEach(scene => {
      if (scene.dirtySet.size) {
        scene.update();
      }
    });
  }

  forceUpdate() {
    this.clear();
    this.sceneSet.forEach(scene => scene.forceUpdate());
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

  _draw() {
    this.sceneSet.forEach(scene => scene.init.call(scene, this));
  }

  _initAnimation() {
    const run = () => {
      this.sceneSet.forEach(scene => scene.animation());
      this.forceUpdate();
      window.requestAnimationFrame(run);
    };

    window.requestAnimationFrame(run);
  }

}

// export const isStr = (v) => typeof v === 'string';
function isFn(fn) {
  return typeof fn === "function";
}
function errorHandler(msg) {
  throw new Error(msg);
}

/**
 * @param  {Shape} shape
 * @param  {number} max_objects=10
 * @param  {number} max_levels=4
 * @param  {number} level=0
 */

class Mesh {
  constructor(pRect, max_objects = 12, max_levels = 4, level = 0) {
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
        indexes; //if we have subnodes, call insert on matching subnodes

    if (this.nodes.length) {
      indexes = this._getIndex(shape);

      for (i = 0; i < indexes.length; i++) {
        this.nodes[indexes[i]].insert(shape);
      }

      return;
    } //otherwise, store object here


    this.objects.push(shape); //max_objects reached

    if (this.objects.length > this.max_objects && this.level < this.max_levels) {
      //split if we don't already have subnodes
      if (!this.nodes.length) {
        this._splitMesh();
      } //add all objects to their corresponding subnode


      for (i = 0; i < this.objects.length; i++) {
        indexes = this._getIndex(this.objects[i]);

        for (let k = 0; k < indexes.length; k++) {
          this.nodes[indexes[k]].insert(this.objects[i]);
        }
      } //clean up this node


      this.objects = [];
    }
  }
  /**
   * @param  {} shape
   */


  retrieve(shape) {
    let indexes = this._getIndex(shape),
        returnObjects = this.objects; //if we have subnodes, retrieve their objects


    if (this.nodes.length) {
      for (let i = 0; i < indexes.length; i++) {
        returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(shape));
      }
    } // remove duplicates


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

  _getBoundAttr(bound) {
    let attr = bound.core || bound;

    if (attr.radius) {
      const diameter = attr.radius * 2;
      attr.width = diameter;
      attr.height = diameter;
    }

    return attr;
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
    let subHeight = height / 2; //top right node

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
   * @param {Shape} shape
   * @return {number[]}       an array of indexes of the intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
   */


  _getIndex(shape) {
    const {
      x,
      y,
      width,
      height
    } = this._getBoundAttr(shape);

    let indexes = [],
        verticalMidpoint = x + width / 2,
        horizontalMidpoint = y + height / 2;
    let startIsNorth = y < horizontalMidpoint,
        startIsWest = x < verticalMidpoint,
        endIsEast = x + width > verticalMidpoint,
        endIsSouth = y + height > horizontalMidpoint; //top-right quad

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
    this.animationSet = new Set();
  }
  /**
   * @param  {Shape} shape
   */


  add(shape) {
    this.shapePools.add(shape);
  }

  init(renderer) {
    const {
      width,
      height,
      element
    } = renderer;

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

  animation() {
    this.animationSet.forEach(anm => anm());
  }

  forceUpdate() {
    this.shapePools.forEach(shape => shape.render());
  } // TODO: 根据网格动态裁剪


  clip(item) {// ctx.clip();
  } // TODO:


  remove(shape) {}
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
      this.dirtySet.add(shape);
      shape.init(renderer);

      if (shape.events && Object.keys(shape.events).length) {
        this.mesh.insert(shape);
      }

      if (isFn(shape.animation)) {
        this.animationSet.add(() => {
          shape.animation.call(shape, shape);
        });
      }

      shape.addListener("update", () => {
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
  } // border(ctx, val) {
  //   const [width, solid, color] = val.split(" ");
  //   ctx.strokeStyle = color;
  // }


};

class Shape extends EventDispatcher {
  constructor({
    core = {},
    style = {},
    events,
    animation
  }) {
    super();
    this.core = this._setTrace(core);
    this.style = this._setTrace(style);
    this.events = events;
    this.animation = animation;
    this.path = new Path2D();
    this.dirty = false;
    this.isEnter = false; // this.oldData = {}
  }
  /**
   * @param  {Renderer} renderer
   */


  init(renderer) {
    const {
      ctx,
      dpr
    } = renderer;
    this.ctx = ctx;
    this.dpr = dpr;
    this.render();
  }

  render() {
    this.dirty = false;
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();

    this._setStyles();

    this.path = this.drawPath();
    ctx.fill(this.path);
    ctx.closePath();
    ctx.restore();
  }

  drawPath() {
    errorHandler("render 需要被重写");
  }
  /**
   * @param  {String} eventName
   * @param  {MouseEvent} event
   */


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
          this.dispatch("update", this);
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

}

class Rect extends Shape {
  constructor(args) {
    super(args);
  }

  drawPath() {
    const shape = new Path2D();
    shape.rect(this.core.x, this.core.y, this.core.width, this.core.height);
    return shape;
  }

}

class Arc extends Shape {
  constructor(args) {
    super(args);
  }

  drawPath() {
    const shape = new Path2D();
    shape.arc(this.core.x, this.core.y, this.core.radius, this.core.startAngle || 0, this.core.endAngle || 2 * Math.PI, !!this.core.counterclockwise);
    return shape;
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
