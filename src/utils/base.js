export const isArr = Array.isArray;
export const isFn = (fn) => typeof fn === 'function';
export const isStr = (v) => typeof v === 'string';
export const isText = (v) => typeof v === 'string' || typeof v === 'number';

export const isStuff = (v) => v !== null && v !== false && v !== true;

export const ShapeFlags = {
  ELEMENT: 1,
  STATEFUL_COMPONENT: 1 << 2,
  TEXT_CHILDREN: 1 << 3,
  ARRAY_CHILDREN: 1 << 4,
}

export const getShapeFlag = (type) => {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}