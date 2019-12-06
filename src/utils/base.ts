
var _toString = Object.prototype.toString;

// 获取 从第九个到倒数第二个
// 比如 [object String]  获取 String
function toRawType (value: any): String {
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

function isObject (obj: any): Boolean {
    return obj !== null && typeof obj === 'object'
}

// 朴素对象
function isPlainObject (obj: any): Boolean {
    return toRawType(obj) === 'Object'
}

// 返回泛型
function getDefaultVal<T>(val: any, emptyVal: any): T {
    return isUndef(val) ? emptyVal : val;
}

/**
 * 缓存函数的执行结果
 */
function cached (fn: Function) {
    var cache = Object.create(null);
    return (function cachedFn (str: string) {
        var hit = cache[str];
        return hit || (cache[str] = fn(str))
    })
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
function typeCheck (typeList: Array<Array<any>>) {
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

export {
    toRawType,
    isUndef,
    isDef,
    isTrue,
    isFalse,
    isObject,
    isPlainObject,
    getDefaultVal,
    cached,
    typeCheck
}
