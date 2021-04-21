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
    this.sceneSet.forEach((scene) => {
      if (scene.dirtySet.size) {
        scene.update();
      }
    });
  }

  forceUpdate() {
    this.clear();
    this.sceneSet.forEach((scene) => scene.forceUpdate());
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
    this.sceneSet.forEach((scene) => scene.init.call(scene, this));
  }

  _initAnimation() {
    const run = () => {
      this.sceneSet.forEach((scene) => scene.animation());
      this.forceUpdate();
      window.requestAnimationFrame(run);
    };
    window.requestAnimationFrame(run);
  }
}

export default Renderer;
