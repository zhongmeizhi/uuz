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
    this.antiAliasing(ele);
  }
  /**
   * @param  {HTMLElement} ele
   */


  antiAliasing(ele) {
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
    scene.inject(this);
    this.scene = scene;
    this.update();
    return this;
  }

  update() {
    if (this.scene.dirtySet.size) {
      console.log('更新');
      this.scene.update();
    }
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

/**
 * fork by https://github.com/timohausmann/QuadTree-js.git

*/

/**
 * QuadTree Constructor
 * @class QuadTree
 * @param {Rect} bounds                 bounds of the node ({ x, y, width, height })
 * @param {number} [max_objects=10]     (optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
 * @param {number} [max_levels=4]       (optional) total max levels inside root QuadTree (default: 4)
 * @param {number} [level=0]            (optional) depth level, required for subnodes (default: 0)
 */
function QuadTree(bounds, max_objects, max_levels, level) {
  this.max_objects = max_objects || 10;
  this.max_levels = max_levels || 4;
  this.level = level || 0;
  this.bounds = bounds;
  this.objects = [];
  this.nodes = [];
}
/**
 * Split the node into 4 subnodes
 * @memberof QuadTree
 */


QuadTree.prototype.split = function () {
  var nextLevel = this.level + 1,
      subWidth = this.bounds.width / 2,
      subHeight = this.bounds.height / 2,
      x = this.bounds.x,
      y = this.bounds.y; //top right node

  this.nodes[0] = new QuadTree({
    x: x + subWidth,
    y: y,
    width: subWidth,
    height: subHeight
  }, this.max_objects, this.max_levels, nextLevel); //top left node

  this.nodes[1] = new QuadTree({
    x: x,
    y: y,
    width: subWidth,
    height: subHeight
  }, this.max_objects, this.max_levels, nextLevel); //bottom left node

  this.nodes[2] = new QuadTree({
    x: x,
    y: y + subHeight,
    width: subWidth,
    height: subHeight
  }, this.max_objects, this.max_levels, nextLevel); //bottom right node

  this.nodes[3] = new QuadTree({
    x: x + subWidth,
    y: y + subHeight,
    width: subWidth,
    height: subHeight
  }, this.max_objects, this.max_levels, nextLevel);
};
/**
 * Determine which node the object belongs to
 * @param {Rect} pRect      bounds of the area to be checked ({ x, y, width, height })
 * @return {number[]}       an array of indexes of the intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
 * @memberof QuadTree
 */


QuadTree.prototype.getIndex = function (pRect) {
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
};
/**
 * Insert the object into the node. If the node
 * exceeds the capacity, it will split and add all
 * objects to their corresponding subnodes.
 * @param {Rect} pRect      bounds of the object to be added ({ x, y, width, height })
 * @memberof QuadTree
 */


QuadTree.prototype.insert = function (pRect) {
  var i = 0,
      indexes; //if we have subnodes, call insert on matching subnodes

  if (this.nodes.length) {
    indexes = this.getIndex(pRect);

    for (i = 0; i < indexes.length; i++) {
      this.nodes[indexes[i]].insert(pRect);
    }

    return;
  } //otherwise, store object here


  this.objects.push(pRect); //max_objects reached

  if (this.objects.length > this.max_objects && this.level < this.max_levels) {
    //split if we don't already have subnodes
    if (!this.nodes.length) {
      this.split();
    } //add all objects to their corresponding subnode


    for (i = 0; i < this.objects.length; i++) {
      indexes = this.getIndex(this.objects[i]);

      for (var k = 0; k < indexes.length; k++) {
        this.nodes[indexes[k]].insert(this.objects[i]);
      }
    } //clean up this node


    this.objects = [];
  }
};
/**
 * Return all objects that could collide with the given object
 * @param {Rect} pRect      bounds of the object to be checked ({ x, y, width, height })
 * @return {Rect[]}         array with all detected objects
 * @memberof QuadTree
 */


QuadTree.prototype.retrieve = function (pRect) {
  var indexes = this.getIndex(pRect),
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
};
/**
 * Clear the QuadTree
 * @memberof QuadTree
 */


QuadTree.prototype.clear = function () {
  this.objects = [];

  for (var i = 0; i < this.nodes.length; i++) {
    if (this.nodes.length) {
      this.nodes[i].clear();
    }
  }

  this.nodes = [];
};

const defaultMeshConfig = {
  width: 300,
  height: 150
};

class Mesh {
  /**
   * @param  {} {width
   * @param  {} height}=defaultMeshConfig
   */
  constructor({
    width,
    height
  } = defaultMeshConfig) {
    this.quadTree = new QuadTree({
      x: 0,
      y: 0,
      width: width,
      height: height
    });
  }
  /**
   * @param  {} geometry
   */


  insert(geometry) {
    this.quadTree.insert(geometry);
  }
  /**
   */


  clear() {
    this.quadTree.clear();
  }
  /**
   * @param  {} mouseX
   * @param  {} mouseY
   */


  queryMouse(mouseX, mouseY, blur = 4) {
    return this.quadTree.retrieve({
      x: mouseX,
      y: mouseY,
      width: blur,
      height: blur
    });
  }

}

class Scene {
  constructor({
    style
  } = {}) {
    // TODO: 添加 Scene 的样式
    this.initMesh();
    this.dirtySet = new Set();
  }

  initMesh() {
    this.mesh = new Mesh({
      x: 0,
      y: 0,
      blur: 4,
      width: this.width,
      height: this.height
    });
  }

  initEvents() {
    this.renderer.element.addEventListener("click", event => {
      const broadPhaseResult = this.mesh.queryMouse(event.offsetX, event.offsetY);
      broadPhaseResult.forEach(geometry => {
        if (geometry.events && typeof geometry.events.click === "function" && this.isPointInPath(geometry, event)) {
          geometry.clickHandler(event);
        }
      });
    });
  }
  /**
   * @param  {Geometry} geometry
   * @param  {MouseEvent} event
   */


  isPointInPath(geometry, event) {
    return this.renderer.ctx.isPointInPath(geometry.path, event.offsetX * this.renderer.dpr, event.offsetY * this.renderer.dpr);
  }
  /**
   * @param  {Geometry} geometry
   */


  add(geometry) {
    geometry.inject(this);
    this.mesh.insert(geometry);
    this.dirtySet.add(geometry);
  } // TODO: 开启局部更新


  update() {
    this.dirtySet.forEach(item => {
      this.clip(item);
      item.render();
    });
    this.dirtySet.clear();
  } // TODO: 根据网格动态裁剪


  clip(item) {
    console.log(item, "item"); // this.renderer.ctx.clip();
    // this.renderer.clear();
    // this.renderer.ctx.restore();
  } // TODO:


  remove(geometry) {}
  /**
   * @param  {Renderer} renderer
   */


  inject(renderer) {
    this.renderer = renderer;
    this.initEvents();
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
    const [color, x, y, blur] = val.split(' ');
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
  }

};

class Geometry {
  constructor(core = {}, style = {}, events = {}) {
    this.core = this.trace(core);
    this.style = this.trace(style);
    this.events = this.trace(events);
    this.scene = null;
    this.path = null;
    this.dirty = false; // this.oldData = {}
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
    });
  } // TODO: 需要性能优化


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

class Rect extends Geometry {
  constructor({
    core,
    style,
    events
  } = {}) {
    super(core, style, events);
  }

  render() {
    const geometry = new Path2D();
    this.paint(() => {
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
    super(core, style, events);
  }

  render() {
    const geometry = new Path2D();
    this.paint(() => {
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
