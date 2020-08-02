import { createElement, ref } from '../uuz.esm.js';

export default {
  setup() {
    let num = ref(20);

    const addNum = () => {
      num.value += 10
    }

    return {
      num,
      addNum
    }
  },
  render() {
    return (
      <div className="abc">
        <button onclick={this.$data.addNum.bind(this)}>{this.$data.num.value}</button>
      </div>
    )
  }
}
