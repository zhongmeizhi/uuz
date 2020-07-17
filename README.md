<h1 align="center">UUZ</h1>

<p align="center">一个 mini-vue3 框架</p>

### 0.1.0

日常维护中，更多内容敬请期待。

项目 rfc 请看[源码日记](https://github.com/zhongmeizhi/fed-note)

目前进度

* [x] reactive
* [x] ref
* [x] computed
* [ ] jsx or template

### Example

```js
import { mount, reactive, ref, computed } from '../src/index.js'

const App = {
  $data: null,
  setup () {
    let count = reactive({ num: 0 })
    let num = ref(233);

    setInterval(() => {
      count.num += 1;
      num.value += 1;
    }, 1000);

    let name = computed(() => {
      return count.num + 'Mokou'
    })

    return {
      count,
      num,
      name
    };

  },
  render() {
    return `<div>
      <button>${this.$data.count.num}</button>
      <span>${this.$data.num.value}</span>
      <div>
        <span>${this.$data.name.value}</span>
      </div>
    </div>`
  }
}

mount(App, document.body)

```