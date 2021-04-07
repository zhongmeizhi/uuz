import Mesh from "@/mesh";
// import Camera from '@/camera'

class Scene {
  constructor({ style }) {
    // TODO: 添加 Scene 的样式
    this.initMesh();
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
        if (geometry.events && typeof geometry.events.click === "function") {
          geometry.clickHandler(event);
        }
      });
    });
  }

  /**
   * @param  {Geometry} geometry
   */
  add(geometry) {
    geometry.inject(this);
    this.mesh.insert(geometry);
  }

  // TODO:
  remove(geometry) {}

  /**
   * @param  {Renderer} renderer
   */
  inject(renderer) {
    this.renderer = renderer;
    this.renderer.updateList.push(...this.mesh.quadTree.objects);
    this.initEvents();
  }

  update() {
    if (!this.renderer) {
      throw new Error('Scene need Renderer')
    }
    this.renderer.update();
  }
}

export default Scene;
