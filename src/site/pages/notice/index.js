import React from 'react';
import Notice from '../../../views/Notice';

import Gap from '../../layout/Gap';

export default () => <Gap>
    <Notice
        text="通知栏，通知栏通知栏"
    ></Notice>
    <Notice
        text="通知栏，通知栏通知栏"
        suffix={<div>去看看</div>}
    ></Notice>
    <Notice
        text="通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏。"
        suffix={<div style={{paddingLeft: '8px'}}>></div>}
    ></Notice>
    <Notice speed="6" text="通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏。"></Notice>
    <Notice
        isScroll={false}
        text="通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏，通知栏通知栏。"
    ></Notice>
</Gap>
