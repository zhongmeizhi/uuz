import { ShapeFlags } from "../utils/base.js";
import  {
  hostSetElementText,
  hostPatchProp,
  hostInsert,
  hostRemove
} from './dom.js';

function isSameVNodeType (n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
};

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
    const keyToNewIndexMap = new Map();
    // 先把 key 和 newIndex 绑定好，方便后续基于 key 找到 newIndex
    for (let i = s2; i <= e2; i++) {
      const nextChild = c2[i];
      keyToNewIndexMap.set(nextChild.key, i);
    }

    // 需要处理新节点的数量
    const toBePatched = e2 - s2 + 1;
    const newIndexToOldIndexMap = new Array(toBePatched);
    for (let index = 0; index < newIndexToOldIndexMap.length; index++) {
      // 源码里面是用 0 来初始化的
      // 但是有可能 0 是个正常值
      // 我这里先用 -1 来初始化
      newIndexToOldIndexMap[index] = -1;
    }
    // 遍历老节点
    // 1. 需要找出老节点有，而新节点没有的 -> 需要把这个节点删除掉
    // 2. 新老节点都有的，—> 需要 patch
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i];
      const newIndex = keyToNewIndexMap.get(prevChild.key);
      newIndexToOldIndexMap[newIndex] = i;

      // 因为有可能 nexIndex 的值为0（0也是正常值）
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
    }

    // 遍历新节点
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
  }

  // oldProps 有，而 newProps 没有了
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
  const { shapeFlag: oldShapeFlag, children: oldChildren } = oldVnode;
  const { shapeFlag, children } = vnode;

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

export {
  patchProps,
  patchChildren
}