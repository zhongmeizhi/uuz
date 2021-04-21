(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['jsx-runtime'] = {}));
}(this, (function (exports) { 'use strict';

  function h(Component, props, ...children) {
    const _props = props || {};

    _props.children = children || [];
    return {
      Component,
      props: _props
    };
  }
  function fragment(props) {
    return props.children;
  }

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
      } //remove duplicates
      // returnObjects = returnObjects.filter(function (item, index) {
      //   return returnObjects.indexOf(item) >= index;
      // });


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

  function traverseGeometry(scene, item) {
    if (Array.isArray(item)) {
      item.forEach(sub => {
        traverseGeometry(scene, sub);
      });
    } else {
      const {
        Component,
        props: {
          children,
          ...val
        } = {}
      } = item;

      if (Component) {
        scene.add(new Component(val));
      }

      if (children) {
        children.forEach(sub => {
          traverseGeometry(scene, sub);
        });
      }
    }
  }

  function mount(root, {
    props
  }) {
    const renderer = new Renderer(root);
    const scene = new Scene(props);
    props.children.forEach(item => {
      traverseGeometry(scene, item);
    });
    renderer.render(scene).animation();
  }

  const jsx = h;
  const jsxs = h;
  const Fragment = fragment;
  const uuz = {
    h,
    fragment,
    mount
  };

  exports.Fragment = Fragment;
  exports.default = uuz;
  exports.jsx = jsx;
  exports.jsxs = jsxs;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
