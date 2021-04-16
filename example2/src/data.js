export default new Array(98).fill({}).map((_, i) => {
  const random = Math.random();
  const num = i + 1;
  return {
    core: {
      x: num * 12,
      y: 100 + Math.floor(50 * random),
      width: 10,
      height: 30 + Math.floor(30 * random)
    },
    style: {
      zIndex: -1,
      background: random > 0.5 ? '#79B83D' : '#C93860'
    }
  }
})