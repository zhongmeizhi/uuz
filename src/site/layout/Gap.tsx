import React from 'react';

interface GapProps {
    children: React.ReactNodeArray | any
}

export default ({children}: GapProps) => React.Children.map(children, (child) => {
    const childTs = child as React.DetailedReactHTMLElement<any, HTMLElement>;
    return <div style={{margin: '6px 0', fontSize: 0}}>{childTs}</div>
})