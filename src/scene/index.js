import Mesh from "@/mesh";
import { isFn } from "@/utils/base.js";

class Scene {
  /**
   * @param  {} {core
   * @param  {} style}={}
   */
  constructor({ core, style } = {}) {
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
    const { width, height, element, ctx } = renderer;
    this.ctx = ctx;
    this._initMesh(width, height);
    this._appendShape(renderer);
    this._initEvents(element);
  }

  update() {
    this.dirtySet.forEach((item) => {
      item.adjustDrawStrategy();
      item.createPath();
      item.dirty = false;
    });
    this.dirtySet.clear();
  }

  animate() {
    this.animateSet.forEach((anm) => anm());
  }

  // TODO: 根据网格动态裁剪
  clip(item) {
    // ctx.clip();
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
      height,
    });
  }

  /**
   * @param  {Renderer} renderer
   */
  _appendShape(renderer) {
    this.shapePools.forEach((shape) => {
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
      shape.addListener("remove", (shape) => {
        this.shapePools.delete(shape);
        this.mesh.remove(shape);
      });
    });
  }

  /**
   * @param  {HtmlElement} element
   */
  _initEvents(element) {
    ["click", "mousemove"].forEach((eventName) => {
      element.addEventListener(eventName, (event) => {
        const broadPhaseResult = this.mesh.queryMouse(
          event.offsetX,
          event.offsetY
        );
        broadPhaseResult.forEach((shape) => {
          shape.eventHandler(eventName, event);
        });
      });
    });
  }
}

export default Scene;
