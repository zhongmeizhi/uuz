import React, { useState, useEffect } from 'react';

import { imgReady } from '../utils/base';

interface WaterfallProps {
    data: Array<any>,
    col: number,
    childRender: any
}

let minEle = {
    idx: 0,
    height: 0 
}

let dataIdx = 0;

/* 
    瀑布流：图片需要从cdn下载，所以不能实时获取到图片宽高

    实现瀑布流的3种情况
    1. 限制图片宽高
    2. 已知图片宽高
    3. 动态获取图片宽高
*/
function Waterfall({ data, col = 2, childRender}: WaterfallProps) {

    let refFlag: Array<HTMLDivElement | any> = [];
    
    const len = data.length;
    const initColData = Array(col).fill('col').map(() => []) as Array<Array<any>>;

    const [colData, setCol] = useState(initColData)

    useEffect(() => {
        if (dataIdx < len) {
            if (dataIdx < col) {
                let initData = JSON.parse(JSON.stringify(initColData));
                for (let i=0; i<col; i++) {
                    initData[i].push(data[i]);
                    dataIdx += 1;
                }

                imgReady(data[dataIdx].url, () => {
                    setCol(initData)
                })

            } else {
                let colIdx = col;
                // 反向遍历，左边优先
                while (--colIdx >= 0) {
                    const offsetTop = refFlag[colIdx].offsetTop;
                    if (!minEle.height || (offsetTop < minEle.height)) {
                        minEle = {
                            idx: colIdx,
                            height: offsetTop
                        }
                    }
                }
                const cloneData = JSON.parse(JSON.stringify(colData));
                cloneData[minEle.idx].push(data[dataIdx]);
                imgReady(data[dataIdx].url, () => {
                    dataIdx += 1;
                    setCol(cloneData)
                    minEle = {
                        idx: 0,
                        height: 0 
                    }
                })
            }
        }
    }, [colData])


    return <div className="zui-waterfall zui-clearfix">
        {
            colData.map((val, idx) => <div key={idx}
                className="zui-waterfall-col"
                style={{
                    width: 100/col + '%'
                }}>
                {
                    val.map((sub, subIdx) => <div key={`${idx}-${subIdx}`}
                        className="zui-waterfall-item">
                        {/* 子模块可以自定义 */}
                        { 
                            typeof childRender === 'function' ?
                                childRender(sub) :
                                <img
                                    className="zui-waterfall-img"
                                    src={sub.url}
                                    alt="瀑布流"
                                />
                        }
                    </div>)
                }
                <div ref={ele => refFlag[idx] = ele}></div>
            </div>)
        }
    </div>
}

export default Waterfall;
