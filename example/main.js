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
