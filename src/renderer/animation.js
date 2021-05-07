class Animation {
  constructor(run) {
    this.run = run;
    this._running = false;
    this.requestAnimationFrame = this._getRaf();
  }

  start() {
    this._running = true;
    this._runAnimation();
  }

  stop() {
    this._running = false;
  }

  _runAnimation() {
    const loops = () => {
      this.run();
      this._running && this.requestAnimationFrame(loops);
    };
    this.requestAnimationFrame(loops);
  }

  _getRaf() {
    return (
      (typeof window !== "undefined" &&
        ((window.requestAnimationFrame &&
          window.requestAnimationFrame.bind(window)) ||
          (window.msRequestAnimationFrame &&
            window.msRequestAnimationFrame.bind(window)) ||
          window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame)) ||
      function (func) {
        return setTimeout(func, 16);
      }
    );
  }
}

export default Animation;
