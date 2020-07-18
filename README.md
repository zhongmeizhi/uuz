<h1 align="center">UUZ</h1>

<p align="center">一个 mini-vue3 框架</p>

### 0.1.0

日常维护中，更多内容敬请期待。

项目 rfc 请看[源码日记](https://github.com/zhongmeizhi/fed-note)

目前进度

* [x] reactive
* [x] ref
* [x] computed
* [x] jsx

### ref

```js
import { createElement, ref } from '../../src/index.js';

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
```

### reactive

```js
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
```

### computed

```js
import { reactive, ref, computed, createElement } from '../../src/index.js'

export default {
  setup() {
    let count = reactive({ num: 10 })
    let num = ref(20);

    let sum = computed(() => {
      return count.num + num.value + '!...'
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
```