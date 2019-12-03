// storiesOf('组件', module)
//     .add('按钮',
//         () => (
//             <>
//                 <Button onClick={() => {}}>默认按钮</Button>
//                 <br></br>
//                 <Button type="raw" onClick={action('点击')}>Raw按钮</Button>
//                 <br></br>
//                 <Button disabled onClick={() => {}}>禁用按钮</Button>
//             </>
//         )
//     )

export default {
    title: '组件'
}

export { button } from './button.js';

export { show } from './show.js';
