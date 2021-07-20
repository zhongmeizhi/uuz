const isArr = Array.isArray;
const isObject = val => val !== null && typeof val === 'object';
const Text = Symbol('Text');
const ShapeFlags = {
  ELEMENT: 1,
  STATEFUL_COMPONENT: 1 << 2,
  TEXT_CHILDREN: 1 << 3,
  ARRAY_CHILDREN: 1 << 4
};
const getShapeFlag = type => {
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
};

const blockStack = [];
let currentBlock = null;
const EMPTY_ARR = [];

function createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  // TODO: Block相关
  const vnode = {
    el: null,
    component: null,
    key: props && props.key || null,
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type)
  };

  if (isArr(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  } else if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }

  return vnode;
} // TODO:


const openBlock = (disableTracking = false) => {
  blockStack.push(currentBlock = disableTracking ? null : []);
}; // TODO:


function createBlock(type, props, children, patchFlag, dynamicProps) {
  /* isBlock: prevent a block from tracking itself */
  const vnode = createVNode(type, props, children, patchFlag, dynamicProps, true); // save current block children on the block vnode

  vnode.dynamicChildren = currentBlock || EMPTY_ARR; // close block

  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null; // a block is always going to be patched, so track it as a child of its
  // parent block

  if (currentBlock) {
    currentBlock.push(vnode);
  }

  return vnode;
}

function createTextVNode(text = '', flag = 0) {
  return createVNode(Text, null, text, flag);
}

const toDisplayString = val => {
  return val == null ? '' : isObject(val) ? JSON.stringify(val, replacer, 2) : String(val);
};

const queue = [];
const p = Promise.resolve();
let isFlushPending = false;

function nextTick(fn) {
  return fn ? p.then(fn) : p;
}

function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job); // 执行所有的 job

    queueFlush();
  }
}

function queueFlush() {
  if (isFlushPending) return;
  isFlushPending = true;
  nextTick(flushJobs);
}

function flushJobs() {
  isFlushPending = false;
  let job;

  while (job = queue.shift()) {
    if (job) {
      job();
    }
  }
}

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

function hostCreateElement(type) {
  const element = document.createElement(type);
  return element;
}

function hostSetElementText(el, text) {
  if (el.nodeType === Node.TEXT_NODE) {
    el.data = text;
  } else {
    el.innerText = text;
  }
}

function hostPatchProp(el, key, preValue, nextValue) {
  // console.log(el, key, preValue, nextValue, 'el, key, preValue, nextValue')
  // TODO: 属性移除和比较
  switch (key) {
    case "id":
    case "tId":
      if (nextValue === null || nextValue === undefined) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, nextValue);
      }

      break;

    case "class":
      el.setAttribute("class", nextValue);
      break;
    // case "onclick":

    case "onClick":
      // todo
      // 先临时实现 click 事件
      // 后面应该用 directive 来处理
      el.addEventListener("click", nextValue);
      break;
  }
}

function hostInsert(child, parent, anchor = null) {
  if (anchor) {
    parent.insertBefore(child, anchor);
  } else {
    parent.appendChild(child);
  }
}

function hostRemove(child) {
  const parent = child.parentNode;

  if (parent) {
    parent.removeChild(child);
  }
}

function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}

function patchKeyedChildren(c1, c2, container) {
  let i = 0;
  let e1 = c1.length - 1;
  let e2 = c2.length - 1;

  while (i <= e1 && i <= e2) {
    const prevChild = c1[i];
    const nextChild = c2[i];

    if (!isSameVNodeType(prevChild, nextChild)) {
      console.log("两个 child 不相等(从左往右比对)");
      break;
    }

    console.log("两个 child 相等，接下来对比着两个 child 节点(从左往右比对)");
    patch(prevChild, nextChild, container);
    i++;
  }

  while (i <= e1 && i <= e2) {
    // 从右向左取值
    const prevChild = c1[e1];
    const nextChild = c2[e2];

    if (!isSameVNodeType(prevChild, nextChild)) {
      console.log("两个 child 不相等(从右往左比对)");
      break;
    }

    console.log("两个 child 相等，接下来对比着两个 child 节点(从右往左比对)");
    patch(prevChild, nextChild, container);
    e1--;
    e2--;
  }

  if (i > e1 && i <= e2) {
    // 如果是这种情况的话就说明 e2 也就是新节点的数量大于旧节点的数量
    // 也就是说新增了 vnode
    // 应该循环 c2
    while (i <= e2) {
      console.log(`需要新创建一个 vnode: ${c2[i].key}`);
      patch(null, c2[i], container);
      i++;
    }
  } else if (i > e2 && i <= e1) {
    // 这种情况的话说明新节点的数量是小于旧节点的数量的
    // 那么我们就需要把多余的
    while (i <= e1) {
      console.log(`需要删除当前的 vnode: ${c1[i].key}`);
      hostRemove(c1[i].el);
      i++;
    }
  } else {
    // 左右两边都比对完了，然后剩下的就是中间部位顺序变动的
    // 例如下面的情况
    // a,b,[c,d,e],f,g
    // a,b,[e,c,d],f,g
    let s1 = i;
    let s2 = i;
    const keyToNewIndexMap = new Map(); // 先把 key 和 newIndex 绑定好，方便后续基于 key 找到 newIndex

    for (let i = s2; i <= e2; i++) {
      const nextChild = c2[i];
      keyToNewIndexMap.set(nextChild.key, i);
    } // 需要处理新节点的数量


    const toBePatched = e2 - s2 + 1;
    const newIndexToOldIndexMap = new Array(toBePatched);

    for (let index = 0; index < newIndexToOldIndexMap.length; index++) {
      // 源码里面是用 0 来初始化的
      // 但是有可能 0 是个正常值
      // 我这里先用 -1 来初始化
      newIndexToOldIndexMap[index] = -1;
    } // 遍历老节点
    // 1. 需要找出老节点有，而新节点没有的 -> 需要把这个节点删除掉
    // 2. 新老节点都有的，—> 需要 patch


    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i];
      const newIndex = keyToNewIndexMap.get(prevChild.key);
      newIndexToOldIndexMap[newIndex] = i; // 因为有可能 nexIndex 的值为0（0也是正常值）
      // 所以需要通过值是不是 undefined 来判断
      // 不能直接 if(newIndex) 来判断

      if (newIndex === undefined) {
        // 当前节点的key 不存在于 newChildren 中，需要把当前节点给删除掉
        hostRemove(prevChild.el);
      } else {
        // 新老节点都存在
        console.log("新老节点都存在");
        patch(prevChild, c2[newIndex], container);
      }
    } // 遍历新节点
    // 1. 需要找出老节点没有，而新节点有的 -> 需要把这个节点创建
    // 2. 最后需要移动一下位置，比如 [c,d,e] -> [e,c,d]


    for (i = e2; i >= s2; i--) {
      const nextChild = c2[i];

      if (newIndexToOldIndexMap[i] === -1) {
        // 说明是个新增的节点
        patch(null, c2[i], container);
      } else {
        // 有可能 i+1 没有元素 没有的话就直接设置为 null
        // 在 hostInsert 函数内如果发现是 null 的话，会直接添加到父级容器内
        const anchor = i + 1 >= e2 + 1 ? null : c2[i + 1];
        hostInsert(nextChild.el, container, anchor && anchor.el);
      }
    }
  }
}

function patchProps(el, oldProps, newProps) {
  // key 存在 oldProps 里 也存在 newProps 内
  // 以 newProps 作为基准
  for (const key in newProps) {
    const prevProp = oldProps[key];
    const nextProp = newProps[key];

    if (prevProp !== nextProp) {
      // 对比属性
      // 需要交给 host 来更新 key
      hostPatchProp(el, key, prevProp, nextProp);
    }
  } // oldProps 有，而 newProps 没有了


  for (const key in oldProps) {
    const prevProp = oldProps[key];
    const nextProp = null;

    if (!(key in newProps)) {
      // 交给 host 更新的时候，把新的值设置为 null
      hostPatchProp(el, key, prevProp, nextProp);
    }
  }
}

function patchChildren(oldVnode, vnode, container) {
  const {
    shapeFlag: oldShapeFlag,
    children: oldChildren
  } = oldVnode;
  const {
    shapeFlag,
    children
  } = vnode;

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    if (children !== oldChildren) {
      hostSetElementText(container, children);
    }
  } else {
    // 对比两个 children
    if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        patchKeyedChildren(oldChildren, children, container);
      }
    }
  }
}

function beforeMount() {
  console.log('beforeMount');
}

function mounted() {
  console.log('mounted');
}

const render = (vnode, container) => {
  patch(null, vnode, container);
};

function patch(oldVnode, vnode, container = null) {
  const {
    type,
    shapeFlag
  } = vnode;

  switch (type) {
    // TODO: 各种类型
    case "text":
      break;

    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(oldVnode, vnode, container);
      } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        processElement(oldVnode, vnode, container);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(oldVnode, vnode, container);
      }

  }
}

function processElement(n1, n2, container) {
  if (!n1) {
    mountElement(n2, container);
  } else {
    updateElement(n1, n2);
  }
}

function updateElement(oldVnode, vnode, container) {
  const oldProps = oldVnode && oldVnode.props || {};
  const newProps = vnode.props || {}; // 需要把 el 挂载到新的 vnode

  const el = vnode.el = oldVnode.el; // 对比

  patchProps(el, oldProps, newProps);
  patchChildren(oldVnode, vnode, el);
}

function mountElement(vnode, container) {
  const {
    shapeFlag,
    props
  } = vnode; // 1. 先创建 element
  // 基于可扩展的渲染 api

  let el;

  if (typeof vnode.type === "symbol" && vnode.type.description === "Text") {
    el = document.createTextNode(vnode.children);
    vnode.el = el;
  } else {
    el = vnode.el = hostCreateElement(vnode.type); // 支持单子组件和多子组件的创建

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el);
    }
  } // 处理 props


  if (props) {
    for (const key in props) {
      const nextVal = props[key];
      hostPatchProp(el, key, null, nextVal);
    }
  }

  hostInsert(el, container);
}

function mountChildren(children, container) {
  children.forEach(VNodeChild => {
    // todo
    // 这里应该需要处理一下 vnodeChild
    // 因为有可能不是 vnode 类型
    console.log("mountChildren:", VNodeChild);
    patch(null, VNodeChild, container);
  });
}

function processComponent(n1, n2, container) {
  // 如果 n1 没有值的话，那么就是 mount
  if (!n1) {
    // 初始化 component
    mountComponent(n2, container);
  }
}

function mountComponent(initialVNode, container) {
  const instance = initialVNode.component = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function createComponentInstance(vnode) {
  const instance = {
    type: vnode.type,
    vnode,
    props: {},
    proxy: null,
    // 其实就是数据
    isMounted: false
  };
  return instance;
}

function setupComponent(instance) {
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const {
    setup,
    render
  } = instance.type;
  const setupResult = setup && setup(instance.props);
  instance.proxy = setupResult;
  instance.render = render;
}

function setupRenderEffect(instance, container) {
  /* 
    经过 sfc 后的代码应该是这样的
     export function render(_ctx, _cache) {
      return (_openBlock(), _createBlock("div", {
        class: "abc",
        onClick: _ctx.addCount
      }, _toDisplayString(_ctx.count.num), 9, ["onClick"]))
    }
  */
  instance.update = effect(function componentEffect() {
    if (!instance.isMounted) {
      const subTree = instance.subTree = instance.render(instance.proxy);
      beforeMount();
      patch(null, subTree, container);
      mounted();
      instance.isMounted = true;
    } else {
      const nextTree = instance.render(instance.proxy);
      const prevTree = instance.subTree;
      instance.subTree = nextTree;
      beforeMount();
      patch(prevTree, nextTree, prevTree.el);
      mounted();
    }
  }, {
    scheduler: effect => {
      // 把 effect 推到微任务的时候在执行
      queueJob(effect);
    }
  });
}

const createApp = (rootComponent, rootProps = null) => {
  const app = {
    mount(rootDom) {
      // 此时 rootComponent = {setup, render}
      const vnode = createVNode(rootComponent, rootProps);
      app._container = rootDom;
      render(vnode, rootDom);
    }

  };
  return app;
};

export { computed, createApp, createBlock, createTextVNode, createVNode, effect, nextTick, openBlock, patch, queueJob, reactive, ref, render, toDisplayString };
