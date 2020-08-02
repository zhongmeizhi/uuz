import { reactive, ref, computed, createElement } from '../uuz.esm.js';

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
  render(state) {
    return (
      <div className="abc">
        <div>
          <button onclick={state.addCount.bind(this)}>{state.count.num}</button>
          <span>+</span>
          <button onclick={state.addNum.bind(this)}>{state.num.value}</button>
        </div>
        <div>合计{state.sum.value}</div>
      </div>
    )
  }
}
