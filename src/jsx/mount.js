import Screen from '../scene/index.js';

function traverseGeometry(screen, item) {
  if (Array.isArray(item)) {
    item.forEach(sub => {
      traverseGeometry(screen, sub)
    })
  } else {
    const { Component, props: { children, ...val } = {}} = item;
    if (Component) {
      screen.add(new Component(val));
    }
    if (children) {
      children.forEach(sub => {
        traverseGeometry(screen, sub)
      })
    }
  }
}

export default function mount(root, {props}) {
  const screen = new Screen(root);
  props.children.forEach(item => {
    traverseGeometry(screen, item);
  })
  screen.update();
  // function run() {
  //   screen.update();
  //   requestAnimationFrame(run)
  // }
  // requestAnimationFrame(run)
  // return screen;
}