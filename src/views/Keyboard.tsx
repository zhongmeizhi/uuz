import React, {useState} from 'react';
import Button from './Button';
import Sheet from './Sheet';
import { ReactComponent as Arrow } from '../static/arrow.svg';

interface KeyboardProps {
    emitButton: React.ReactNode,
    header: React.ReactNode,
    onChange?: Function
}

export default function Keyboard({emitButton, header, onChange}: KeyboardProps) {

    const [keyList, setKeyList] = useState([] as Array<number>);

    const changeKeyList = (keyList: Array<number>) => {
        setKeyList(keyList);
        (typeof onChange === 'function') && onChange(keyList.join(''));
    }

    const reset = () => {
        setKeyList([] as Array<number>);
    }

    const keyClickHandler = (val: number) => () => {
        const keyListCopy = keyList.slice();
        keyListCopy.push(val);
        changeKeyList(keyListCopy);
    }

    const removeKeyHandler = () => {
        const keyListCopy = keyList.slice();
        keyListCopy.pop();
        changeKeyList(keyListCopy);
    }

    return <Sheet button={emitButton} header={header} canModalClose>
        <div className={"zui-keyboard"}>
            {[1,2,3,4,5,6,7,8,9].map(val => <Button type="raw" className="zui-key" onClick={keyClickHandler(val)} key={val}>{val}</Button>)}
            <div className="zui-key"></div>
            <Button type="raw" className="zui-key" onClick={keyClickHandler(0)}>0</Button>
            <Button type="raw" className="zui-key zui-key-del" onClick={removeKeyHandler}><Arrow className="zui-key-arrow"></Arrow></Button>
        </div>
    </Sheet>
}