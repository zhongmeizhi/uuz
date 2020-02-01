import React from 'react';

import Swiper from '../../../views/Swiper';

function TestContent({val, children}) {
    return <div style={{
        height: '100%',
        // background: `rgb(33, 133, ${val*51})`,
        background: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>{children}{val}</div>
}

export default () => {
    return <div>
        <Swiper height={'333px'} direction="y">
            {
                [1,2,3,4,5].map(val => <Swiper.Item key={val}>
                    <TestContent val={val}>上下滑</TestContent>
                </Swiper.Item>)
            }
        </Swiper>
        <br></br>
        <Swiper height={'333px'}>
            {
                [1,2,3,4,5].map(val => <Swiper.Item key={val}>
                    <TestContent val={val}>左右滑</TestContent>
                </Swiper.Item>)
            }
        </Swiper>
    </div>
}
