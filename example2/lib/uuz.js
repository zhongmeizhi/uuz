import '@timohausmann/quadtree-js';

class Scene {
  /**
   * @param  {} eleSelector
   */
  constructor(eleSelector) {
    const ele = document.querySelector(eleSelector);

    if (!ele) {
      throw new Error('不能找到匹配的dom元素');
    }

    this.initState(ele); // this.initEvents(ele);
  }
  /**
   * @param  {} ele
   */


  initState(ele) {
    this.ctx = ele.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    const width = ele.width;
    const height = ele.height; // 抗锯齿和 isPointInPath 无法兼容。。。

    ele.style.width = width + 'px';
    ele.style.height = height + 'px';
    ele.width = width * this.dpr;
    ele.height = height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.width = width;
    this.height = height;
    this.dom = ele; // this.geometryList = [];

    this.ctx.save();
  }

  initGrid() {
    this.grid = new {
      width: this.width,
      height: this.height,
      blur: 8
    }();
  } // initEvents(ele) {
  //   this.eventPools = {
  //     click: [],
  //     mouseenter: [],
  //     mouseleave: []
  //   };
  //   // TODO: 事件抽离，加入四叉树网格
  //   const eventPools = content.eventPools;
  //   // FIXME: 实例数据刷新后事件没有更新
  //   ele.addEventListener('click', (e) => {
  //     eventPools.click.forEach(({geometry, event}) => {
  //       if (this.ctx.isPointInPath(geometry, e.offsetX, e.offsetY)) {
  //         event(e);
  //       }
  //     })
  //   })
  //   ele.addEventListener('mousemove', (e) => {
  //     eventPools.mouseenter.forEach(({geometry, event}) => {
  //       if (!geometry.isMouseenter && this.ctx.isPointInPath(geometry, e.offsetX, e.offsetY)) {
  //         event(e);
  //         geometry.isMouseenter = true;
  //       }
  //     })
  //     eventPools.mouseleave.forEach(({geometry, event}) => {
  //       if (geometry.isMouseenter && !this.ctx.isPointInPath(geometry, e.offsetX, e.offsetY)) {
  //         event(e);
  //         geometry.isMouseenter = false;
  //       }
  //     })
  //   })
  // }

  /**
   * @param  {} geometry
   */


  add(geometry) {
    geometry.mount(this); // this.geometryList.push(geometry);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  update() {
    this.clear(); // this.geometryList.forEach(geometry => {
    //   geometry.render(this.ctx, this.eventPools)
    // })
  }

}

const styleMap = {
  background(ctx, val) {
    ctx.fillStyle = val;
  },

  opacity(ctx, val) {
    ctx.globalAlpha = val;
  },

  boxShadow(ctx, val) {
    const [color, x, y, blur] = val.split(' ');
    ctx.shadowColor = color;
    ctx.shadowOffsetX = x;
    ctx.shadowOffsetY = y;
    ctx.shadowBlur = blur;
  },

  // TODO: 优化zIndex规则
  zIndex(ctx, val) {
    if (val > 0) {
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.globalCompositeOperation = "destination-over";
    }
  }

};

const content = {
  eventPools: {
    click: [],
    mouseenter: [],
    mouseleave: []
  },

  pushEvent(key, event) {
    this.eventPools[key].push(event);
  }

};

class Geometry {
  constructor(core = {}, style = {}, events = {}) {
    this.core = core;
    this.style = style;
    this.events = events;
    this.geometry = null;
    this.isInitEvent = false;
  }

  setEventHandler() {
    if (this.isInitEvent) return;
    if (typeof this.events !== "object") return;

    for (let k of Object.keys(this.events)) {
      content.pushEvent(k, {
        geometry: this.geometry,
        event: this.events[k].bind(this)
      });
    }

    this.isInitEvent = true;
  }
  /**
   * @param  {} ctx
   */


  setStyles(ctx) {
    for (let k of Object.keys(this.style)) {
      const exec = styleMap[k];

      if (exec) {
        exec(ctx, this.style[k]);
      }
    }
  }

  paint(ctx, render) {
    if (ctx && typeof render === "function") {
      ctx.save();
      ctx.beginPath();
      this.setStyles(ctx);
      this.geometry = render();
      this.setEventHandler();
      ctx.fill(this.geometry);
      ctx.closePath();
      ctx.restore();
    }
  }

  mount(scene) {
    this.scene = scene;
  }

  update() {} // TODO: 等diff完成


  destroy() {}

}

class Rect extends Geometry {
  constructor({
    core,
    style,
    events
  } = {}) {
    super(core, style, events);
  }

  render(ctx) {
    const geometry = new Path2D();
    this.paint(ctx, () => {
      geometry.rect(this.core.x, this.core.y, this.core.width, this.core.height);
      return geometry;
    });
  }

}

class Arc extends Geometry {
  constructor({
    core,
    style,
    events
  } = {}) {
    super(core, style, events);
  }

  render(ctx) {
    const geometry = new Path2D();
    this.paint(ctx, () => {
      geometry.arc(this.core.x, this.core.y, this.core.radius, this.core.startAngle || 0, this.core.endAngle || 2 * Math.PI, !!this.core.counterclockwise);
      return geometry;
    });
  }

}

class Group {}

const uuz = {
  Scene,
  Rect,
  Arc,
  Group
};

export default uuz;
