import React from 'react';

interface GapProps {
    children: React.ReactNode
}

export default ({children}: GapProps) => React.Children.map(children, (child) => {
    const childTs = child as React.DetailedReactHTMLElement<any, HTMLElement>;
    return <div style={{margin: '6px 0'}}>
        {childTs}
    </div>
})