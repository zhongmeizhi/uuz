import React, {useState} from 'react'
import Keyboard from '../../../views/Keyboard';
import Button from '../../../views/Button';

export default () => {


    const onClick = (val) => {
        console.log(val)
    }

    return <div style={{margin: '50px 16px'}}>
        <Keyboard
            onClick={onClick}
        ></Keyboard>
    </div>
};