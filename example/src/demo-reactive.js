import { createElement, reactive } from '../../src/index.js';

export default {
  setup() {
    let count = reactive({ num: 10 })

    const addCount = () => {
      count.num += 10;
    }

    return {
      count,
      addCount
    }
  },
  render() {
    return (
      <div className="abc">
        <button onclick={this.$data.addCount.bind(this)}>{this.$data.count.num}</button>
      </div>
    )
  }
}
