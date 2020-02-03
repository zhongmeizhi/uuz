
var _toString = Object.prototype.toString;

// 获取 从第九个到倒数第二个
// 比如 [object String]  获取 String
function toRawType(value: any): String {
    return _toString.call(value).slice(8, -1)
}

// 是否 未定义
function isUndef(v: any):Boolean {
    return v === undefined || v === null
}

// 是否 有定义
function isDef(v: any): Boolean {
    return v !== undefined && v !== null
}

function isTrue(v: any): Boolean {
    return v === true
}

function isFalse(v: any): Boolean {
    return v === false
}

function isObject(obj: any): Boolean {
    return obj !== null && typeof obj === 'object'
}

// 朴素对象
function isPlainObject(obj: any): Boolean {
    return toRawType(obj) === 'Object'
}

// 匹配默认值
function getValOrDefault<T>(val: any, emptyVal: any): T {
    return isUndef(val) ? emptyVal : val;
}

/**
 * 缓存函数的执行结果
 */
function cached(fn: Function) {
    var cache = Object.create(null);
    return (function cachedFn (str: string) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str))
    })
}

// 返回结果 要么是正则，要么就不是。
const isRegExp = (reg: any): reg is RegExp => {
    return '[object RegExp]' === _toString.call(reg)
}

// 首字母大写
const upperCaseFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/* 
    参考 Vue 获取className的方式
    获取 className 
*/
function getClassName(obj: {[key: string]: boolean | undefined}): string {
    if (isObject(obj)) {
        const keys = Object.keys(obj);
        let className = ''
        for(let key of keys) {
            const item = obj[key];
            if (item === true) {
                className += ` ${key}`;
            }
        }
        return className;
    }
    return ''
}


/* 
    是否为 React Element
*/
function isReactElement(obj: any) {
    if (obj &&
            obj['$$typeof'] &&
            obj['$$typeof'].toString() === 'Symbol(react.element)'
        ) {
        return true;
    }
}

/* 
    参数校验机制
*/
function typeCheck(typeList: Array<Array<any>>) {
    for (let typeChild of typeList) {
        console.log(typeChild)
        const [name, value] = typeChild.splice(0, 2);
        const actualType = toRawType(value);
        if (typeChild.indexOf(actualType) === -1) {
            if (typeChild.includes('Element')) {
                if (!isReactElement(value)) {
                    console.error(new Error(`${name} 期望是:${typeChild}, 实际是:${actualType}`))
                return 'Thorw Error';
                }
            } else {
                console.error(new Error(`${name} 期望是:${typeChild}, 实际是:${actualType}`))
                return 'Thorw Error';
            }
        }
    }
}

/* 
    单例
*/
function singleton() {
    var _instance: any;
    return function(obj: any) {
        return _instance || (_instance = obj);
    }
}

/* 
    图片 ready，
    每一帧调用一次
*/
function imgReady(url: string, callback: Function, errorBack?: Function) {
    var imgObj = new Image();
    imgObj.src = url;
    // TODO
    // 改成 requestAnimationFrame
    var timer = setInterval(function () {
        if(imgObj.width > 0 && imgObj.height > 0) {
            callback();
            clearInterval(timer);
        }
        imgObj.onerror = function() {
            (errorBack && errorBack()) || callback();
            clearInterval(timer);
        }
    }, 18);
}

// passive 检测
function passiveSupported(): boolean {
    let passiveSupported = false;
    try {
        const options = Object.defineProperty({}, 'passive', {
            get: () => {
                return passiveSupported = true;
            },
        });
        window.addEventListener('test', null as any, options);
    } catch (err) { }
    return passiveSupported;
}

function getEventPoint(e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) {
    let eventPoint: any;
    if (e.type.indexOf('touch') === 0) {
        eventPoint = (e as React.TouchEvent<HTMLDivElement>).touches[0];
    } else {
        eventPoint = (e as React.MouseEvent<HTMLDivElement>);
    }
    return eventPoint;
}

export {
    toRawType,
    isUndef,
    isDef,
    isTrue,
    isFalse,
    isObject,
    isPlainObject,
    isRegExp,
    upperCaseFirst,
    getValOrDefault,
    cached,
    getClassName,
    typeCheck,
    singleton,
    imgReady,
    passiveSupported,
    getEventPoint
}
