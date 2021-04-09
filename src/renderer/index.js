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
    this.antiAliasing(ele);
  }

  /**
   * @param  {HTMLElement} ele
   */
  antiAliasing(ele) {
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
    if (this.scene.dirtySet.size) {
      console.log('更新')
      this.scene.update();
    }
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
    }
    window.requestAnimationFrame(run);
  }
}

export default Renderer;
