import uuz from '../lib/uuz.js';
import kLineData from '../src/data.js'

const scene = new uuz.Scene('#canvas')

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
    click(e, ctx) {
      if (this.mk) {
        this.style.background = this.mk;
        this.mk = null
      } else {
        this.mk = this.style.background || 'black';
        this.style.background = "#ffff00";
      }
    },
  }
})

scene.add(arc)

kLineData.forEach(val => {
  scene.add(new uuz.Rect({
    ...val,
    events: {
      mouseenter(e, ctx) {
        this.mk = this.style.background || 'black';
        this.style.background = "#ffff00";
      },
      mouseleave(e, ctx) {
        this.style.background = this.mk;
        this.mk = null
      },
    }
  }))
})

function move() {
  const geometry = scene.geometryList.slice(-1)[0];
  const dis = (0.5 - Math.random()) * 5
  geometry.core.height += dis;
  geometry.core.y -= dis;
}

function run() {
  move()
  scene.update()
  requestAnimationFrame(run);
}

requestAnimationFrame(run);