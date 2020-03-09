import React from 'react';
import Button from '../../../views/Button';

import Gap from '../../layout/Gap';

const action = (val) => () => console.log(val)

export default () => <div style={{margin: '50px 16px'}}>
    <Gap>
        <Button onClick={action('点击')}>默认按钮</Button>
        <Button type="raw" onClick={action('点击')}>Raw按钮</Button>
        <Button type="warn" onClick={action('点击')}>警告</Button>
        <Button disabled>禁用按钮</Button>
        <Button avatar onClick={action('点击')}>avatar 按钮</Button>
        <div>
            <Button width="100px" height="30px" onClick={action('点击')}>自定义宽高</Button>
            <Button width="160px" height="30px" type="warn" onClick={action('点击')}>自定义宽高</Button>
        </div>
        <Button type="raw" width="120px" height="120px" avatar onClick={action('点击')}>
            <img width="120px" src="https://zhongmeizhi.github.io/static/test/4.jpg" alt="乔巴"></img>
        </Button>
    </Gap>
</div>
