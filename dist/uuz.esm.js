const isFn = fn => typeof fn === 'function';
const isText = v => typeof v === 'string' || typeof v === 'number';
const isStuff = v => v !== null && v !== false && v !== true;

const createElement = function (type, attrs, ...children) {
  let props = attrs || {};
  let key = props.key || null;
  let ref = props.ref || null;
  delete props.key;
  delete props.ref;
  const childrenElement = [].concat(...children).reduce((list, child) => {
    if (isStuff(child)) {
      const vnode = isText(child) ? createText(child) : child;
      list.push(vnode);
    }

    return list;
  }, []);
  props.children = childrenElement;
  return {
    type,
    props,
    key,
    ref
  };
};

const createText = text => {
  return {
    type: 'text',
    props: {
      children: [],
      content: text
    }
  };
};

let targetMap = new WeakMap();
let activeEffect;

function effect(fn, options = {}) {
  const _effect = function (...args) {
    activeEffect = _effect;
    return fn(...args);
  };
  /* computed相关 */


  if (!options.lazy) {
    _effect();
  }
  /* 
    options 比如：scheduler
  */


  _effect.options = options;
  return _effect;
}

function track(target, key) {
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }

  let dep = depsMap.get(key);

  if (!dep) {
    depsMap.set(key, dep = new Set());
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = new Set();
  depsMap.get(key).forEach(e => effects.add(e));
  effects.forEach(e => scheduleRun(e));
}

function scheduleRun(effect) {
  console.log(effect.options, 'ops');

  if (effect.options.scheduler !== void 0) {
    effect.options.scheduler(effect);
  } else {
    effect();
  }
}

function reactive(target) {
  return new Proxy(target, {
    get(target, prop) {
      track(target, prop);
      return Reflect.get(target, prop);
    },

    set(target, prop, newVal) {
      Reflect.set(target, prop, newVal);
      trigger(target, prop);
      /* 
        必须 return true;
        否则会产生警告 'set' on proxy: trap returned falsish for property
      */

      return true;
    }

  });
}

function ref(target) {
  let value = target;
  const obj = {
    get value() {
      track(obj, 'value');
      return value;
    },

    set value(newVal) {
      if (newVal !== value) {
        value = newVal;
        trigger(obj, 'value');
      }
    }

  };
  return obj;
}

function computed(fn) {
  let dirty = true;
  let value;

  let _computed;

  const runner = effect(fn, {
    lazy: true,
    scheduler: e => {
      if (!dirty) {
        dirty = true;
        trigger(_computed, 'value');
      }
    }
  });
  _computed = {
    get value() {
      if (dirty) {
        value = runner();
        dirty = false;
      }

      track(_computed, 'value');
      return value;
    }

  };
  return _computed;
}

const createApp = rootComponent => {
  const app = {
    mount(rootDom) {
      render(rootComponent, rootDom);
    }

  };
  return app;
};

function render(instance, dom, oldDom) {
  effect(function () {
    if (!instance.active) {
      instance.$data = instance.setup();
      instance.active = true;
    }

    let vnode = instance.render();
    diff(vnode, dom, oldDom || dom.firstChild);
  });
}

const diff = (vnode, dom, oldDom) => {
  // 获得在创建元素是的vnode
  let oldVnode = oldDom && oldDom.vnode;

  if (!oldDom) {
    mount(vnode, dom, oldDom);
  } else if (isFn(vnode.type)) {
    diffComponent(vnode, null, dom, oldDom);
  } else if (oldVnode && oldVnode.type === vnode.type) {
    diffElement(oldDom, vnode, oldVnode);
  } else {
    // TODO: 
    console.log('不值得比较了');
  }
};

const diffComponent = (vnode, oldVnode, dom, oldDom) => {
  if (!oldVnode) {
    mount(vnode, dom, oldDom);
  }
};

const diffElement = (oldDom, vnode, oldVnode) => {
  if (oldVnode.type === 'text') {
    updateTextNode(oldDom, vnode, oldVnode);
  } else {
    updateElement(oldDom, vnode, oldVnode);
  }

  oldDom.vnode = vnode;
  vnode.props.children.forEach((child, i) => {
    // children:只包含元素节点
    // childNodes:包含所有类型的节点
    // 这时需要在h函数中剔除undefined元素
    diff(child, oldDom, oldDom.childNodes[i]);
  }); // 试图剔除多余节点 childNodes

  let oldChildNodes = oldDom.childNodes;
  let oldMaxIndex = oldChildNodes.length - 1;
  let vnodeMaxIndex = vnode.props.children.length - 1; // 剔除多余节点

  if (oldMaxIndex > vnodeMaxIndex) {
    // 从后面开始删除，保证index顺序
    for (let i = oldMaxIndex; i > vnodeMaxIndex; i--) {
      unmountNode(oldDom, oldChildNodes[i]);
    }
  }
};

const mount = (vnode, dom, oldDom) => {
  if (isFn(vnode.type)) {
    return mountComponent(vnode, dom, oldDom);
  } else {
    return mountElement(vnode, dom, oldDom);
  }
};

const mountComponent = (vnode, dom, oldDom) => {
  // resetHook(vnode, dom, oldDom);
  let nextVnode = vnode;

  while (isFn(nextVnode.type)) {
    nextVnode = nextVnode.type(vnode.props || {});
  }

  return mount(nextVnode, dom, oldDom);
};

const mountElement = (vnode, dom, oldDom, parent) => {
  /*
    在 h 函数中已经将数组扁平化
    在处理 map 等jsx 的时候不需要再通过再次判断数组递归
  */
  let newDom = null;
  const nextSibiling = oldDom && oldDom.nextSibiling;

  if (vnode.type === 'text') {
    newDom = document.createTextNode(vnode.props.content);
  } else {
    newDom = document.createElement(vnode.type);
    updateElement(newDom, vnode);
  } // 生成元素的的时候顺便造一颗vnode树


  newDom.vnode = vnode;

  if (oldDom) {
    unmountNode(parent, oldDom);
  }

  if (nextSibiling) {
    dom.insertBefore(newDom, nextSibiling);
  } else {
    dom.appendChild(newDom);
  }

  vnode.props.children.forEach(child => {
    mount(child, newDom);
  });
};

const updateElement = (dom, newVnode, oldVnode = {}) => {
  const newProps = newVnode.props || {};
  const oldProps = oldVnode.props || {}; // 将新旧属性同时比较以减少遍历次数

  for (let name in { ...oldProps,
    ...newProps
  }) {
    let oldValue = oldProps[name];
    let newValue = newProps[name];

    if (oldValue == newValue || name === 'children') ; else if (name === 'style') ; else if (name === 'className') {
      dom.setAttribute('class', newValue);
    } else if (name.startsWith('on')) {
      const eventName = name.slice(2).toLowerCase();
      if (oldValue) dom.removeEventListener(eventName, oldValue, false);
      dom.addEventListener(eventName, newValue, false);
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, newValue);
    }
  }
};

const updateTextNode = (dom, newVnode, oldVnode = {}) => {
  if (newVnode.props.content !== oldVnode.props.content) {
    dom.textContent = newVnode.props.content;
  }

  dom.vnode = newVnode;
};

const unmountNode = (dom, child) => {
  child.remove();
};

export { computed, createApp, createElement, effect, reactive, ref, render };
