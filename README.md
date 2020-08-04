<h1 align="center">UUZ</h1>

<p align="center">一个 mini-vue3 框架</p>

### 简介

`uuz`拥有`vue3`核心功能。仅4.4kb大小。

`uuz`驱动器是`uuzpack`，一个比`vite`更加精简的工具。

支持本库名称作为文件后缀如 `demo.uuz`。

项目 rfc 请看[源码日记](https://github.com/zhongmeizhi/fed-note)

期待老铁们陪我结对编程。

## 0.2.0 版本

由 `uuzpack` 驱动，通过解析 `.uuz` 实现 sfc，函数名向`vue3`靠拢。

example：通过 `demo.uuz` 实现双向绑定

```vue
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

## 0.1.0 版本

0.1.0版本采用的是`babel-react`实现jsx，并完成了数据绑定功能

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