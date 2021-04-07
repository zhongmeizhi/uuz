class Renderer {
  /**
   * @param  {string} eleSelector
   */
  constructor(eleSelector) {
    const ele = document.querySelector(eleSelector);
    if (!ele) {
      throw new Error("不能找到匹配的dom元素");
    }
    this.initCanvas(ele);
    this.updateList = [];
  }

  /**
   * @param  {HTMLElement} ele
   */
  initCanvas(ele) {
    this.ctx = ele.getContext("2d");
    this.dpr = window.devicePixelRatio || 1;
    const width = ele.width;
    const height = ele.height;
    // 抗锯齿和 isPointInPath 无法兼容。。。
    ele.style.width = width + "px";
    ele.style.height = height + "px";
    ele.width = width * this.dpr;
    ele.height = height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.width = width;
    this.height = height;
    this.element = ele;

    this.ctx.save();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateList = [];
  }

  /**
   * @param  {Scene} scene
   */
  render(scene) {
    scene.inject(this)
    this.update();
  }

  update() {
    this.updateList.forEach(item => {
      item.render();
    })
  }

  // TODO: 根据网格动态裁剪
  clip() {
    // this.ctx.rect(60,20,200,120);
    // this.ctx.clip();
    // this.ctx.update();
  }
}

export default Renderer;
