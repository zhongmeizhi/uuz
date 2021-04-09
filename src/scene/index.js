import Mesh from "@/mesh";
class Scene {
  constructor({ style }) {
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
      height: this.height,
    });
  }

  initEvents() {
    this.renderer.element.addEventListener("click", (event) => {
      const broadPhaseResult = this.mesh.queryMouse(
        event.offsetX,
        event.offsetY
      );
      broadPhaseResult.forEach((geometry) => {
        if (
          geometry.events &&
          typeof geometry.events.click === "function" &&
          this.isPointInPath(geometry, event)
        ) {
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
    return this.renderer.ctx.isPointInPath(
      geometry.path,
      event.offsetX * this.renderer.dpr,
      event.offsetY * this.renderer.dpr
    );
  }

  /**
   * @param  {Geometry} geometry
   */
  add(geometry) {
    geometry.inject(this);
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
  inject(renderer) {
    this.renderer = renderer;
    this.initEvents();
  }
}

export default Scene;
