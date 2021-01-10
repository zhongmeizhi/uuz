const QuadTree = require('@timohausmann/quadtree-js');

const quadTree = new QuadTree({
  x: 0,
  y: 0,
  width: 300,
  height: 300
});

quadTree.clear();

quadTree.insert({
  x: 10,
  y: 10,
  width: 10,
  height: 10,
});

quadTree.insert({
  x: 280,
  y: 10,
  width: 10,
  height: 10,
});

quadTree.insert({
  x: 10,
  y: 280,
  width: 10,
  height: 10,
});

quadTree.insert({
  x: 280,
  y: 280,
  width: 10,
  height: 10,
});

const results = quadTree.retrieve({
  x: 100,
  y: 100,
  width: 1,
  height: 1,
});

console.log(results, 'results')
