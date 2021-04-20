import Mesh from "@/mesh";
import EventDispatcher from "@/utils/eventDispatcher.js";
import { isArr } from "@/utils/base.js";

class Scene extends EventDispatcher {
  /**
   * @param  {} {core
   * @param  {} style}={}
   */
  constructor({ core, style } = {}) {
    super();
    // TODO: 添加 Scene 的样式
    this.dirtySet = new Set();
    this.shapePools = new Set();
  }

  /**
   * @param  {Shape} shape
   */
  add(shape) {
    this.shapePools.add(shape);
  }

  init(renderer) {
    const { width, height, element } = renderer;
    this._initMesh(width, height);
    this._initShape(renderer);
    this._initEvents(element);
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
    this.mesh.traverse((shape) => shape.render());
  }

  // TODO: 根据网格动态裁剪
  clip(item) {
    console.log(item, "item");
    // ctx.clip();
  }

  // TODO:
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
      height,
    });
  }

  /**
   * @param  {Renderer} renderer
   */
  _initShape(renderer) {
    this.shapePools.forEach((shape) => {
      this.mesh.insert(shape);
      this.dirtySet.add(shape);
      shape.addListener("update", () => {
        this.dirtySet.add(shape);
      });
      shape.init(renderer);
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
