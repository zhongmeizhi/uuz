const isObject = (val) => val !== null && typeof val === 'object';

const toDisplayString = (val) => {
  return val == null
    ? ''
    : isObject(val)
      ? JSON.stringify(val, replacer, 2)
      : String(val);
};

export {
  toDisplayString
}