import React, {useState} from 'react';
import Button from './Button';
import Close from './sub-views/Close';

interface KeyboardProps {
    onClick: Function
}

export default function Keyboard ({onClick = () => {}}: KeyboardProps) {

    const [keyList, setKeyList] = useState([] as Array<string>);

    const emitClick = (key: string) => {
        typeof onClick === 'function' && onClick(key);
    }

    const keyClickHandler = (val: string) => () => {
        const keyListCopy = keyList.slice();
        keyListCopy.push(val);
        setKeyList(keyListCopy);
        emitClick(val);
    }

    const removeKeyHandler = (val: string) => () => {
        const keyListCopy = keyList.slice();
        keyListCopy.pop();
        setKeyList(keyListCopy);
        emitClick(val);
    }

    const ensureHandler = (val: string) => () => {
        emitClick(val);
    }

    return <div className={"zui-keyboard"}>
        {['1','2','3','4','5','6','7','8','9'].map(val => <Button type="raw" className="zui-key" onClick={keyClickHandler(val)} key={val}>{val}</Button>)}
        <Button type="raw" className="zui-key zui-key-del" onClick={removeKeyHandler('del')}><Close className="zui-key-arrow"></Close></Button>
        <Button type="raw" className="zui-key" onClick={keyClickHandler('0')}>0</Button>
        <Button className="zui-key" onClick={ensureHandler('ensure')}>确定</Button>
    </div>
}

