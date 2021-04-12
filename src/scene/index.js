import Mesh from "@/mesh";
class Scene {
  constructor({ style } = {}) {
    // TODO: 添加 Scene 的样式
    this._initMesh();
    this.dirtySet = new Set();
  }

  _initMesh() {
    this.mesh = new Mesh({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    });
  }

  initEvents() {
    ["click", "mousemove"].forEach((eventName) => {
      this.renderer.element.addEventListener(eventName, (event) => {
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
    geometry._inject(this);
    this.mesh.insert(geometry);
    this.dirtySet.add(geometry);
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
    this.mesh.objects.forEach((item) => item.render());
  }

  // TODO: 根据网格动态裁剪
  clip(item) {
    console.log(item, "item");
    // this.renderer.ctx.clip();
    // this.renderer.clear();
    // this.renderer.ctx.restore();
  }

  // TODO:
  remove(geometry) {}

  /**
   * @param  {Renderer} renderer
   */
  _inject(renderer) {
    this.renderer = renderer;
    this.initEvents();
  }
}

export default Scene;
