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
      scene.inject(this);
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

  const defaultMeshConfig = {
    x: 0,
    y: 0,
    width: 300,
    height: 150
  };

  class Mesh {
    /**
     * @param  {} {width
     * @param  {} height}=defaultMeshConfig
     */
    constructor(bounds = defaultMeshConfig, max_objects = 10, max_levels = 4, level = 0) {
      this.max_objects = max_objects;
      this.max_levels = max_levels;
      this.level = level;
      this.bounds = bounds;
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

  class Scene {
    constructor({
      style
    } = {}) {
      // TODO: 添加 Scene 的样式
      this._initMesh();

      this.dirtySet = new Set();
    }

    _initMesh() {
      this.mesh = new Mesh({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height
      });
    }

    initEvents() {
      ["click", "mousemove"].forEach(eventName => {
        this.renderer.element.addEventListener(eventName, event => {
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
    }

    forceUpdate() {
      this.mesh.objects.forEach(item => item.render());
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
