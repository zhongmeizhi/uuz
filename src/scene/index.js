import Mesh from "@/mesh";
import EventDispatcher from "@/utils/eventDispatcher.js";
import { isArr, isFn } from "@/utils/base.js";

class Scene extends EventDispatcher {
  /**
   * @param  {} {core
   * @param  {} style}={}
   */
  constructor({ core, style } = {}) {
    super();
    // TODO: 添加 Scene 的样式
    this.dirtySet = new Set();
    this.newGeometryPool = [];
    this._init();
  }

  _init() {
    this.addListener("mounting", this._mounting);
    this.addListener("mounted", this._mounted);
  }

  _mounting(renderer) {
    const { width, height } = renderer;
    this.renderer = renderer;
    this.mesh = new Mesh({
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  _mounted() {
    this.newGeometryPool.forEach((geometry) => {
      geometry.dispatch("mounting", this);
      geometry.dispatch("mounted", this);
      this.mesh.insert(geometry);
      this.dirtySet.add(geometry);
    });
    this._initEvents(this.renderer);
  }

  _initEvents(renderer) {
    ["click", "mousemove"].forEach((eventName) => {
      renderer.element.addEventListener(eventName, (event) => {
        const broadPhaseResult = this.mesh.queryMouse(
          event.offsetX,
          event.offsetY
        );
        broadPhaseResult.forEach((geometry) => {
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
  }

  // TODO: 开启局部更新
  update() {
    this.dirtySet.forEach((item) => {
      this.clip(item);
      item.render();
    });
    this.dirtySet.clear();
  }

  forceUpdate() {
    this._traverseMesh(this.mesh);
    // (node) => {
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
      mesh.nodes.forEach((node) => this._traverseMesh(node));
    } else if (isArr(mesh.objects)) {
      mesh.objects.forEach((geometry) => geometry.render());
    }
  }

  // TODO: 根据网格动态裁剪
  clip(item) {
    console.log(item, "item");
    // ctx.clip();
  }

  // TODO:
  remove(geometry) {}
}

export default Scene;
