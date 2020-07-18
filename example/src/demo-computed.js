import { reactive, ref, computed, createElement } from '../../src/index.js'

export default {
  setup() {
    let count = reactive({ num: 10 })
    let num = ref(20);
    let sum = computed(() => {
      return count.num + num.value + '!'
    })

    const addCount = () => {
      count.num += 10;
    }

    const addNum = () => {
      num.value += 10
    }

    return {
      count,
      num,
      sum,
      addCount,
      addNum
    }
  },
  render() {
    return (
      <div className="abc">
        <div>
          <button onclick={this.$data.addCount.bind(this)}>{this.$data.count.num}</button>
          <span>+</span>
          <button onclick={this.$data.addNum.bind(this)}>{this.$data.num.value}</button>
        </div>
        <div>合计{this.$data.sum.value}</div>
      </div>
    )
  }
}
