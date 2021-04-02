(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global['jsx-runtime'] = {}));
}(this, (function (exports) { 'use strict';

	function h(Component, props, ...children) {
	  const _props = props || {};

	  _props.children = children || [];
	  return {
	    Component,
	    props: _props
	  };
	}
	function fragment(props) {
	  return props.children;
	}

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

	function traverseGeometry(screen, item) {
	  if (Array.isArray(item)) {
	    item.forEach(sub => {
	      traverseGeometry(screen, sub);
	    });
	  } else {
	    const {
	      Component,
	      props: {
	        children,
	        ...val
	      } = {}
	    } = item;

	    if (Component) {
	      screen.add(new Component(val));
	    }

	    if (children) {
	      children.forEach(sub => {
	        traverseGeometry(screen, sub);
	      });
	    }
	  }
	}

	function mount(root, {
	  props
	}) {
	  const screen = new Scene(root);
	  props.children.forEach(item => {
	    traverseGeometry(screen, item);
	  });
	  screen.update(); // function run() {
	  //   screen.update();
	  //   requestAnimationFrame(run)
	  // }
	  // requestAnimationFrame(run)
	  // return screen;
	}

	const jsx = h;
	const uuz = {
	  h,
	  fragment,
	  mount
	};

	exports.default = uuz;
	exports.jsx = jsx;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
