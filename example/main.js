import { templateRender, render, reactive, ref, computed, createElement } from '../src/index.js'

// const setupApp = {
//   $data: null,
//   setup () {
//     let count = reactive({ num: 0 })
//     let num = ref(233);

//     setInterval(() => {
//       count.num += 1;
//       num.value += 1;
//     }, 1000);

//     let name = computed(() => {
//       return count.num + 'Mokou'
//     })

//     return {
//       count,
//       num,
//       name
//     };

//   },
//   render() {
//     return `<div>
//       <button>${this.$data.count.num}</button>
//       <span>${this.$data.num.value}</span>
//       <div>
//         <span>${this.$data.name.value}</span>
//       </div>
//     </div>`
//   }
// }

// templateRender(setupApp, document.querySelector('#setup'));

function TestItem() {
  return <div className="test">
    test
  </div>
}

function JsxApp() {
  let count = reactive({ num: 0 })
  let num = ref(233);

  const addCount = () => {
    count.num += 1;
  }

  return <div className="abc">
    <button onclick={addCount}>{count.num}</button>
    <TestItem></TestItem>
    {num.value}
  </div>
}

render(<JsxApp />, document.querySelector('#functional'));
