import { nextTick } from '@/utils/base.js';

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
    this.updateList = [];
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
    // this.updateList.length = 0;
  }

  /**
   * @param  {Scene} scene
   */
  render(scene) {
    scene.inject(this)
    this.update();
    this.updateList = new Proxy(this.updateList, {
      set: (target, prop, value) => {
        target[prop] = value;
        nextTick(() => {
          this.clear();
          this.update();
        })
        return true;
      }
    });
  }

  // TODO: 局部更新
  update() {
    console.log('更新')
    this.updateList.forEach(item => {
      item.render();
    })
    // this.updateList.length = 0;
  }

  // TODO: 根据网格动态裁剪
  clip() {
    // this.ctx.rect(60,20,200,120);
    // this.ctx.clip();
    // this.ctx.update();
  }
}

export default Renderer;
