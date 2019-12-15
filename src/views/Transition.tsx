import React, {useState, useEffect} from 'react';

interface TransitionProps {
    name: string,
    children: React.ReactNode
}

type ChildType = React.DetailedReactHTMLElement<{
    name: string;
    children: React.ReactNode;
    props: {},
    className: string;
}, HTMLElement>

export default function Transition({name, children}: TransitionProps) {

    const initName = name || '';

    const [transitionName, setName] = useState(`${initName}-in`);

    useEffect(() => {
        console.log(11111);
        return () => {
            console.log(222222)
            setName(`${initName}-out`)
        }
    }, [])

    return <>
        {React.Children.map(children, (child) => {
            const childTs = child as React.DetailedReactHTMLElement<any, HTMLElement>;
            return React.cloneElement(childTs,
                {
                    children,
                    className:  `${childTs.props.className}  ${transitionName}`
                },
                children
            )
        })}
    </>
    // <div className={transitionName}>
    //     {children}
    // </div>
}
