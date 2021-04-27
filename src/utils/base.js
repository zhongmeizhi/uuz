export function isStr(v) {
  return typeof v === "string";
}

export function isNumber(v) {
  return typeof v === "number";
}

export function isObject(val) {
  return val !== null && typeof val === "object";
}

export const isArr = Array.isArray;

export function isFn(fn) {
  return typeof fn === "function";
}

export function errorHandler(msg) {
  throw new Error(msg);
}

export const Static = Symbol("Static");

export function nextTick(fn) {
  Promise.resolve().then(fn.bind(null));
}
