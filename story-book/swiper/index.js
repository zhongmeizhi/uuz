import React from 'react';

import Swiper from '../../src/views/Swiper';

function randomStyle(val) {
    return {
        height: '100%',
        background: `rgb(33, 133, ${val*51})`
    }
}

export default () => {
    return <div>
        <Swiper height={'300px'} direction="y">
            {
                [1,2,3,4,5].map(val => <Swiper.Item key={val}>
                    <div style={randomStyle(val)}>滑块{val}</div>
                </Swiper.Item>)
            }
        </Swiper>
        <br></br>
        <Swiper height={'300px'}>
            {
                [1,2,3,4,5].map(val => <Swiper.Item key={val}>
                    <div style={randomStyle(val)}>滑块{val}</div>
                </Swiper.Item>)
            }
        </Swiper>
    </div>
}
