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
    opacity: 0.6,
    boxShadow: "red 2 3 3",
    background: "#79B83D",
  },
  events: {
    click(geometry) {
      if (geometry.bg) {
        geometry.style.background = geometry.bg;
        geometry.core.x -= 100;
        geometry.bg = null;
      } else {
        geometry.bg = geometry.style.background;
        geometry.core.x += 100;
        geometry.style.background = "#ffff00";
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
  kLineData[0].core.x += 1;
});
