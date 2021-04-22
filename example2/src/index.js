import uuz from "../lib/uuz.js";
import kLineData from "../src/mock-data.js";

const renderer = new uuz.Renderer("#canvas");
const scene = new uuz.Scene();

kLineData.staticData.forEach((val) =>
  scene.add(
    new uuz.Arc({
      ...val,
      events: {
        mouseenter(shape) {
          shape.z = shape.style.zIndex;
          shape.o = shape.style.opacity;
          shape.style.zIndex = 1;
          shape.style.opacity = 1;
        },
        mouseleave(shape) {
          shape.style.zIndex = shape.z;
          shape.style.opacity = shape.o;
        },
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
    })
  )
);

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
