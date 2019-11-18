
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

export {
    toRawType,
    isUndef,
    isDef,
    isTrue,
    isFalse,
    isObject,
    isPlainObject,
    getDefaultVal
}
