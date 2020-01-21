import React from 'react';

import Swiper, {SwiperItem} from '../../src/views/Swiper';

function TestContent({val}) {
    return <div style={{
        height: '100%',
        // background: `rgb(33, 133, ${val*51})`,
        background: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>上下滑{val}</div>
}

export default () => {
    return <div>
        <Swiper height={'200px'} direction="y">
            {
                [1,2,3,4,5].map(val => <SwiperItem key={val}>
                    <TestContent props={val}></TestContent>
                </SwiperItem>)
            }
        </Swiper>
        <br></br>
        <Swiper height={'200px'}>
            {
                [1,2,3,4,5].map(val => <SwiperItem key={val}>
                    <TestContent val={val}></TestContent>
                </SwiperItem>)
            }
        </Swiper>
    </div>
}
