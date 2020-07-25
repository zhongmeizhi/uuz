import { isStuff, isText } from '../utils/base.js';

const createElement = function (type, attrs, ...children) {
  let props = attrs || {};
  let key = props.key || null
  let ref = props.ref || null

  delete props.key
  delete props.ref

  const childrenElement = [].concat(...children).reduce((list, child) => {
    if (isStuff(child)) {
      const vnode = isText(child) ? createText(child) : child;
      list.push(vnode);
    }
    return list;
  }, [])

  props.children = childrenElement;
  return { type, props, key, ref };
}

const createText = (text) => {
  return {
    type: 'text',
    props: {
      children: [],
      content: text,
    }
  }
}

/* 
  在vue3中没有了 createElement取而代之的是 createBlock 和 createVNode

  createBlock主要比createVNode多生成一个dynamicChildren
*/

// 一些节点的类型，都是位表示法  - -
var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

function getShapeFlag(type) {
  return typeof type === "string"
      ? ShapeFlags.ELEMENT
      : ShapeFlags.STATEFUL_COMPONENT;
}

// 创建节点
var createVNode = function (type, props, children) {
  if (props === void 0) { props = {}; }
  var vnode = {
      el: null,
      component: null,
      key: props.key || null,
      type: type,
      props: props,
      children: children,
      shapeFlag: getShapeFlag(type),
  };
  if (Array.isArray(children)) {
      vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  else if (typeof children === "string") {
      vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  }
  return vnode;
};

var h = function (type, props, children) {
  return createVNode(type, props, children);
};


export {
  createElement
}