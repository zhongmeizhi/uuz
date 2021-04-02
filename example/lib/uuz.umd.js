(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.uuz = factory());
}(this, (function () { 'use strict';

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

  // import Camera from '@/camera'

  class Scene {
    constructor(eleSelector) {
      const ele = document.querySelector(eleSelector);

      if (!ele) {
        throw new Error('不能找到匹配的dom元素');
      }

      this.initState(ele);
      this.initEvents(ele);
    }

    initState(ele) {
      this.ctx = ele.getContext('2d');
      this.dpr = window.devicePixelRatio || 1;
      const width = ele.width;
      const height = ele.height; // TODO: 锯齿和isPointInPath
      // ele.style.width = width + 'px';
      // ele.style.height = height + 'px';
      // ele.width = width * this.dpr;
      // ele.height = height * this.dpr;
      // this.ctx.scale(this.dpr, this.dpr);

      this.width = width;
      this.height = height;
      this.dom = ele;
      this.geometryList = [];
      this.ctx.save();
    }

    initEvents(ele) {
      // TODO: 事件抽离，加入四叉树网格
      const eventPools = content.eventPools; // FIXME: 实例数据刷新后事件没有更新

      ele.addEventListener('click', e => {
        eventPools.click.forEach(({
          geometry,
          event
        }) => {
          if (this.ctx.isPointInPath(geometry, e.offsetX, e.offsetY)) {
            event(e);
          }
        });
      });
      ele.addEventListener('mousemove', e => {
        eventPools.mouseenter.forEach(({
          geometry,
          event
        }) => {
          if (!geometry.isMouseenter && this.ctx.isPointInPath(geometry, e.offsetX, e.offsetY)) {
            event(e);
            geometry.isMouseenter = true;
          }
        });
        eventPools.mouseleave.forEach(({
          geometry,
          event
        }) => {
          if (geometry.isMouseenter && !this.ctx.isPointInPath(geometry, e.offsetX, e.offsetY)) {
            event(e);
            geometry.isMouseenter = false;
          }
        });
      });
    }

    add(geometry) {
      this.geometryList.push(geometry);
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

    update() {
      this.clear();
      this.geometryList.forEach(geometry => {
        geometry.render(this.ctx);
      });
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
      this.paint(ctx, () => {
        const geometry = new Path2D();
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
      this.paint(ctx, () => {
        const geometry = new Path2D();
        geometry.arc(this.core.x, this.core.y, this.core.radius, 0, 2 * Math.PI // this.core.startAngle,
        // this.core.endAngle,
        // this.core.counterclockwise
        );
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

  return uuz;

})));
