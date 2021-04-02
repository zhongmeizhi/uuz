const content = {
  eventPools: {
    click: [],
    mouseenter: [],
    mouseleave: []
  },
  pushEvent(key, event) {
    this.eventPools[key].push(event);
  }
}

export default content;