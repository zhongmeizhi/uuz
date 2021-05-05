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
    this.hoverSet = new Set();
    this.activeSet = new Set();
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
    this._appendShape();
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

  _appendShape() {
    this.shapePools.forEach((shape) => {
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
  // TODO: 优化事件穿透
  _initEvents(element) {
    element.addEventListener("click", (event) => {
      const broadPhaseResult = this.mesh.queryMouse(
        event.offsetX,
        event.offsetY
      );
      broadPhaseResult.forEach((shape) => {
        shape.eventHandler("click", event);
      });
    });
    element.addEventListener("mousemove", (event) => {
      const broadPhaseResult = this.mesh.queryMouse(
        event.offsetX,
        event.offsetY
      );
      broadPhaseResult.forEach((shape) => {
        const isPointInPath = shape.isPointInPath(event);
        if (isPointInPath) {
          this.activeSet.add(shape);
          shape.eventHandler("mousemove", event);
        }
        if (!this.hoverSet.has(shape) && isPointInPath) {
          this.hoverSet.add(shape);
          shape.eventHandler("mouseenter", event);
        }
      });
      // 处理可能存在的mesh边界问题，找到mouseleave的shape
      this.hoverSet.forEach((shape) => {
        if (!this.activeSet.has(shape)) {
          this.hoverSet.delete(shape);
          shape.eventHandler("mouseleave", event);
        }
      });
      this.activeSet = new Set();
    });
  }
}

export default Scene;
