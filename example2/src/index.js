import uuz from '../lib/uuz.js';
import kLineData from '../src/data.js'

const renderer = new uuz.Renderer('#canvas')

const scene = new uuz.Scene({
  style: {}
})

const arc = new uuz.Arc({
  core: {
    x: 100,
    y: 75,
    radius: 30
  },
  style: {
    opacity: 0.6,
    boxShadow: 'red 2 3 3',
    background: '#79B83D'
  },
  events: {
    click(geometry) {
      if (geometry.mk) {
        geometry.style.background = this.mk;
        geometry.mk = null
      } else {
        geometry.mk = geometry.style.background || 'black';
        geometry.style.background = "#ffff00";
      }
    },
  }
})

scene.add(arc)

kLineData.forEach(val => {
  scene.add(new uuz.Rect({
    ...val,
    events: {
      mouseenter(geometry) {
        geometry.mk = geometry.style.background || 'black';
        geometry.style.background = "#ffff00";
      },
      mouseleave(geometry) {
        geometry.style.background = geometry.mk;
        geometry.mk = null
      },
    }
  }))
})

renderer.render(scene);

function move() {
  const kLine = kLineData.slice(-1)[0];
  const dis = (0.5 - Math.random()) * 5
  kLine.core.height += dis;
  kLine.core.y -= dis;
}

function run() {
  move()
  renderer.update()
  requestAnimationFrame(run);
}

requestAnimationFrame(run);