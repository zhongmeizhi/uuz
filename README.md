<h1 align="center">UUZ</h1>

<p align="center">一个 mini-vue3 框架</p>

日常维护中，更多内容敬请期待。

项目 rfc 请看[源码日记](https://github.com/zhongmeizhi/fed-note)

### 0.2.0 版本

由 `uuzpack` 驱动，支持文件格式 `.uuz`

example：通过 `demo.uuz` 实现双向绑定

```uuz
<template>
  <div class="abc" @click="addCount">
    {{count.num}}
  </div>
</template>

<script>
import { reactive } from '../uuz.esm.js';

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
  }
}
</script>
```

### 0.1.0 版本

目前进度

* [x] reactive
* [x] ref
* [x] computed
* [x] jsx

example

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