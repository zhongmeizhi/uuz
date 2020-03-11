import React from 'react';

interface MarbleLoadingProps {
    className?: string
}

// 弹珠式Loading
export default function MarbleLoading({className = ''}: MarbleLoadingProps) {
    return <div
        className={`zui-marble-loading ${className}`}>
        <div className="zui-marble"></div>
        <div className="zui-marble"></div>
        <div className="zui-marble"></div>
    </div>
}