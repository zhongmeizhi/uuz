function randMinMax(min, max, round) {
  var val = min + (Math.random() * (max - min));
  if (round) val = Math.round(val);
  return val;
};

let myObjects = (function createObjects() {
  let myObjects = []
  for (var i = 0; i < 200; i = i + 1) {
    myObjects.push({
      core: {
        x: randMinMax(0, 1200),
        y: randMinMax(0, 600),
        width: randMinMax(10, 20),
        height: randMinMax(10, 20),
        vx: randMinMax(-0.5, 0.5),
        vy: randMinMax(-0.5, 0.5),
      },
      style: {
        zIndex: -1,
        background: Math.random() > 0.5 ? '#79B83D' : '#C93860'
      }
    });
  }
  return myObjects;
})();


export default myObjects;