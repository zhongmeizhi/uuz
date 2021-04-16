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
    mouseenter(geometry) {
      geometry.bg = geometry.style.background || "black";
      geometry.style.background = "#ffff00";
    },
    mouseleave(geometry) {
      geometry.style.background = geometry.bg;
      geometry.bg = null;
    },
    click(geometry) {
      if (geometry.isMove) {
        geometry.core.x -= 100;
        geometry.core.radius -= 30;
        geometry.isMove = false;
      } else {
        geometry.core.x += 100;
        geometry.core.radius += 30;
        geometry.isMove = true;
      }
    },
  },
});

scene.add(arc);

kLineData.forEach((val) => {
  scene.add(
    new uuz.Rect({
      ...val,
      events: {
        mouseenter(geometry) {
          geometry.mk = geometry.style.background || "black";
          geometry.style.background = "#ffff00";
        },
        mouseleave(geometry) {
          geometry.style.background = geometry.mk;
          geometry.mk = null;
        },
      },
    })
  );
});

renderer.render(scene).animation((renderer) => {
  kLineData[0].style.background = "#aabbcc"
  kLineData[0].style.zIndex = 1;
  kLineData[0].core.x += 1;
});
