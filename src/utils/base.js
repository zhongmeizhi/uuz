export const isArr = Array.isArray;
export const isFn = (fn) => typeof fn === 'function';
export const isStr = (v) => typeof v === 'string';
export const isObject = (val) => val !== null && typeof val === 'object';

export const Static = Symbol( 'Static' );

export function nextTick(fn) {
  return Promise.resolve().then(fn.bind(null));
}