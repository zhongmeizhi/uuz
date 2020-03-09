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
    const [isConShow, setConShow] = useState(isShow);

    useEffect(() => {
        if (isShow) {
            setConShow(isShow);
            setTimeout(() => {
                setName(`${initName}--in`);
            }, 18); // 下一帧 > 16.67
        } else {
            console.log('out')
            setName(`${initName}--out`);
            // 正常关闭
            setTimeout(() => {
                setName('');
                setConShow(false);
            }, time);
        }
    }, [isShow])

    return <>
        {
            isConShow ?
                React.Children.map(children, (child) => {
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
