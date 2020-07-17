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

export {
  createElement
}