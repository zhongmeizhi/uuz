import { isStuff, isText } from '../utils/base.js';

const createElement = function (type, attrs, ...children) {
  console.log(type, attrs, children, 'xxx')
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


export {
  createElement
}