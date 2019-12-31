import React, {useState, useEffect} from 'react';

interface TransitionProps {
    name: string,
    isShow: boolean,
    children: React.ReactNode,
    time?: number
}

export default function Transition({name, isShow, children, time = 300}: TransitionProps) {

    const initName = name || '';

    const [transitionName, setName] = useState('');
    const [isConShow, setConShow] = useState(false);

    useEffect(() => {
        if (isShow) {
            setConShow(true);
            setTimeout(() => {
                setName(`${initName}--in`);
            }, 34); // 下两帧
        }
        return () => {
            // 当销毁时 设置 class 为 out
            if (!isConShow && isShow) {
                setName(`${initName}--out`);
                // 正常关闭
                setTimeout(() => {
                    setConShow(false);
                    setName('');
                }, time);
                // TODO
                // 也可以通过 transitionEnd 来计算结束时间
                // 但是如果没有设置动画效果那么怎么办？
                // 如何判断是否有动画效果？
            }
        }
    }, [isShow])

    return <>
        { 
            isConShow ? React.Children.map(children, (child) => {
                    const childTs = child as React.DetailedReactHTMLElement<any, HTMLElement>;
                    return React.cloneElement(childTs,
                        {
                            className:  `${childTs.props.className} ${transitionName}`,
                        },
                        // children // 外包裹
                    )
                })
                : null
        }
    </>
}
