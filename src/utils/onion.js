class Onion {
  constructor() {
    this.index = 0;
    this.middleWares = [];
  }

  use(fn) {
    this.middleWares.push(fn);
    return this;
  }

  next() {
    const length = this.middleWares.length;
    if (this.index >= length) return;
    while (this.index < length) {
      const m = this.middleWares[this.index++];
      m();
    }
  }
}
