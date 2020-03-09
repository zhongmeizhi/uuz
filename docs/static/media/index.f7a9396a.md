# 瀑布流

| 参数             | 值                                       |
| ---------------- | ---------------------------------------- |
| data             | { url: 'xx', // 其他随意 }               |
| col              | 列数：number 默认为 2                    |
| childRender      | Function 接收 瀑布流的item，需要返回 JSX |
| 不传 childRender | 默认根据 url 展示图片                    |
| linkName         | string 图片url键名，默认 'url'           |


```
const data = Array(21).fill('data').map((val, idx) => {
    return {
        url: `https://zhongmeizhi.github.io/static/test/${20-idx}.jpg`,
        name: `瀑布流`,
        desc: `${idx}`
    }
})


function SubBody(props) {
    return <>
        <img className="test-waterfall-img" alt="瀑布流"
            src={props.url}></img>
        <p className="zui-waterfall-txt">{props.name}</p>
        <p className="zui-waterfall-txt">{props.desc}</p>
    </>
}

export default () => {
    return <div>
        <Waterfall
            data={data}
            col={3}
            childRender={SubBody}
        ></Waterfall>
    </div>
}
```