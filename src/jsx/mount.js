import Renderer from "../renderer/index.js";
import Scene from "../scene/index.js";

function traverseGeometry(scene, item) {
  if (Array.isArray(item)) {
    item.forEach((sub) => {
      traverseGeometry(scene, sub);
    });
  } else {
    const { Component, props: { children, ...val } = {} } = item;
    if (Component) {
      scene.add(new Component(val));
    }
    if (children) {
      children.forEach((sub) => {
        traverseGeometry(scene, sub);
      });
    }
  }
}

export default function mount(root, { props }) {
  const renderer = new Renderer(root);
  const scene = new Scene(props);
  props.children.forEach((item) => {
    traverseGeometry(scene, item);
  });
  renderer.render(scene).animation();
}
