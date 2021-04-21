import uuz from "../lib/uuz.js";
import kLineData from "../src/data.js";

const renderer = new uuz.Renderer("#canvas");

const scene = new uuz.Scene({
  style: {},
});

const arc = new uuz.Arc({
  core: {
    x: 100,
    y: 75,
    radius: 30,
  },
  style: {
    zIndex: 1,
    opacity: 0.6,
    // boxShadow: "red 2 3 3",
    background: "#79B83D",
  },
  events: {
    click(shape) {
      if (shape.isMove) {
        shape.core.x -= 100;
        shape.core.radius -= 30;
        shape.isMove = false;
      } else {
        shape.core.x += 100;
        shape.core.radius += 30;
        shape.isMove = true;
      }
    },
  },
});

scene.add(arc);

kLineData.staticData.forEach((val) => {
  scene.add(new uuz.Arc({...val}));
});

kLineData.dynamicData.forEach((val) => {
  scene.add(
    new uuz.Rect({
      ...val,
      events: {
        mouseenter(shape) {
          shape.mk = shape.style.background || "black";
          shape.style.background = "#ffff00";
        },
        mouseleave(shape) {
          shape.style.background = shape.mk;
          shape.mk = null;
        },
      },
      animation({ core }) {
        core.x += core.vx;
        core.y += core.vy;
        const { width, height } = renderer;
        if (core.x > width) core.x = 0;
        if (core.x < 0) core.x = width;
        if (core.y > height) core.y = 0;
        if (core.y < 0) core.y = height;
      },
    })
  );
});

renderer.render(scene);
