function hostCreateElement(type) {
  const element = document.createElement(type);
  return element;
}

function hostSetElementText(el, text) {
  el.innerText = text;
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

function hostInsert(child, parent, anchor=null) {
  if (anchor) {
    parent.insertBefore(child,anchor);
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

export {
  hostCreateElement,
  hostSetElementText,
  hostPatchProp,
  hostInsert,
  hostRemove
}