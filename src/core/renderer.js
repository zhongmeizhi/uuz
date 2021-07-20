import { ShapeFlags } from "../utils/base.js";
import { queueJob } from "./scheduler";
import { createVNode } from "./h";
import { effect } from "./reactive";
import {
  hostCreateElement,
  hostSetElementText,
  hostPatchProp,
  hostInsert,
} from "./dom.js";

import { patchProps, patchChildren } from "./diff.js";

import { beforeMount, mounted } from "./lifecycle.js";

const render = (vnode, container) => {
  patch(null, vnode, container);
};

function patch(oldVnode, vnode, container = null) {
  const { type, shapeFlag } = vnode;
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
    updateElement(n1, n2, container);
  }
}

function updateElement(oldVnode, vnode, container) {
  const oldProps = (oldVnode && oldVnode.props) || {};
  const newProps = vnode.props || {};
  // 需要把 el 挂载到新的 vnode
  const el = (vnode.el = oldVnode.el);

  // 对比
  patchProps(el, oldProps, newProps);
  patchChildren(oldVnode, vnode, el);
}

function mountElement(vnode, container) {
  const { shapeFlag, props } = vnode;
  // 1. 先创建 element
  // 基于可扩展的渲染 api
  let el;
  if (typeof vnode.type === "symbol" && vnode.type.description === "Text") {
    el = document.createTextNode(vnode.children);
    vnode.el = el;
  } else {
    el = vnode.el = hostCreateElement(vnode.type);

    // 支持单子组件和多子组件的创建
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el);
    }
  }
  // 处理 props
  if (props) {
    for (const key in props) {
      const nextVal = props[key];
      hostPatchProp(el, key, null, nextVal);
    }
  }

  hostInsert(el, container);
}

function mountChildren(children, container) {
  children.forEach((VNodeChild) => {
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
  } else {
    // todo
    // updateComponent()
  }
}

function mountComponent(initialVNode, container) {
  const instance = (initialVNode.component =
    createComponentInstance(initialVNode));

  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function createComponentInstance(vnode) {
  const instance = {
    type: vnode.type,
    vnode,
    props: {},
    proxy: null, // 其实就是数据
    isMounted: false,
  };

  return instance;
}

function setupComponent(instance) {
  initProps();
  initSlots();

  setupStatefulComponent(instance);
}

function initProps() {
  // TODO:
}

function initSlots() {
  // TODO:
}

function setupStatefulComponent(instance) {
  const { setup, render } = instance.type;
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
  instance.update = effect(
    function componentEffect() {
      if (!instance.isMounted) {
        const subTree = (instance.subTree = instance.render(instance.proxy));
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
    },
    {
      scheduler: (effect) => {
        // 把 effect 推到微任务的时候在执行
        queueJob(effect);
      },
    }
  );
}

const createApp = (rootComponent, rootProps = null) => {
  const app = {
    mount(rootDom) {
      // 此时 rootComponent = {setup, render}
      const vnode = createVNode(rootComponent, rootProps);
      app._container = rootDom;
      render(vnode, rootDom);
    },
  };
  return app;
};

export { createApp, render, patch };
