export const isArr = Array.isArray;
export const isFn = (fn) => typeof fn === 'function';
export const isStr = (v) => typeof v === 'string';
export const isText = (v) => typeof v === 'string' || typeof v === 'number';

export const isStuff = (v) => v !== null && v !== false && v !== true;