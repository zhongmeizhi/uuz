import React, { useState, useEffect } from 'react';

import { imgReady } from '../utils/base';
import WaterfallManager from '../controller/waterfall';

interface WaterfallProps {
    data: Array<any>,
    col: number,
    childRender: any,
    linkName: string
}
/* 
    瀑布流：图片需要从cdn下载，所以不能实时获取到图片宽高

    已知获取图片宽高的方法
    1. 限制图片宽高
    2. 已知图片宽高
    3. 等待图片加载获取宽高
*/
function Waterfall({ data, col = 2, childRender, linkName = 'url'}: WaterfallProps) {

    let refFlag: Array<HTMLDivElement | any> = [];
    
    const len = data.length;
    const initColData = Array(col).fill('col').map(() => []) as Array<Array<any>>;
    const [colData, setCol] = useState(initColData);

    const slotManager = new WaterfallManager();
    slotManager.setData(data);
    slotManager.setCol(col);
    
    const [dataManager, setManager] = useState(slotManager);
    const [curIdx, setCurIdx] = useState(0);

    useEffect(() => {
        if (curIdx < len - 1) {
            if (curIdx < col - 1) {
                dataManager.setFirstRowData()
                setCol(dataManager.getColData());
            } else {
                dataManager.pushDataToLowCol(refFlag);
                setCol(dataManager.getColData());
            }
            const dataIdx = dataManager.getCurIdx();
            imgReady(data[dataIdx][linkName], () => {
                setCurIdx(dataIdx);
            })
        }
    }, [curIdx])

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
                                    src={sub[linkName]}
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
