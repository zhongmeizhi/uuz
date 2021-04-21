let staticData = (function createObjects() {
  let staticData = [];
  for (var i = 0; i < 20; i = i + 1) {
    staticData.push({
      core: {
        x: randMinMax(0, 1200),
        y: randMinMax(0, 600),
        radius: randMinMax(10, 20),
      },
      style: {
        zIndex: -1,
        background: Math.random() > 0.5 ? "#79B83D" : "#C93860",
      },
    });
  }
  return staticData;
})();

function randMinMax(min, max, round) {
  var val = min + Math.random() * (max - min);
  if (round) val = Math.round(val);
  return val;
}

let dynamicData = (function createObjects() {
  let dynamicData = [];
  for (var i = 0; i < 100; i = i + 1) {
    dynamicData.push({
      core: {
        x: randMinMax(0, 1200),
        y: randMinMax(0, 600),
        width: randMinMax(10, 20),
        height: randMinMax(10, 20),
        vx: randMinMax(-0.5, 0.5),
        vy: randMinMax(-0.5, 0.5),
      },
      style: {
        zIndex: 1,
        background: Math.random() > 0.5 ? "#79B83D" : "#C93860",
      },
    });
  }
  return dynamicData;
})();

export default {
  dynamicData,
  staticData,
};
