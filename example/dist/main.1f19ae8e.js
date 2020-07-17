// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/utils/base.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStuff = exports.isText = exports.isStr = exports.isFn = exports.isArr = void 0;
var isArr = Array.isArray;
exports.isArr = isArr;

var isFn = function isFn(fn) {
  return typeof fn === 'function';
};

exports.isFn = isFn;

var isStr = function isStr(v) {
  return typeof v === 'string';
};

exports.isStr = isStr;

var isText = function isText(v) {
  return typeof v === 'string' || typeof v === 'number';
};

exports.isText = isText;

var isStuff = function isStuff(v) {
  return v !== null && v !== false && v !== true;
};

exports.isStuff = isStuff;
},{}],"../src/core/h.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = void 0;

var _base = require("../utils/base.js");

var createElement = function createElement(type, attrs) {
  var _ref;

  var props = attrs || {};
  var key = props.key || null;
  var ref = props.ref || null;
  delete props.key;
  delete props.ref;

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var childrenElement = (_ref = []).concat.apply(_ref, children).reduce(function (list, child) {
    if ((0, _base.isStuff)(child)) {
      var vnode = (0, _base.isText)(child) ? createText(child) : child;
      list.push(vnode);
    }

    return list;
  }, []);

  props.children = childrenElement;
  return {
    type: type,
    props: props,
    key: key,
    ref: ref
  };
};

exports.createElement = createElement;

var createText = function createText(text) {
  return {
    type: 'text',
    props: {
      children: [],
      content: text
    }
  };
};
},{"../utils/base.js":"../src/utils/base.js"}],"../src/core/reactive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reactive = reactive;
exports.ref = ref;
exports.effect = effect;
exports.computed = computed;
var targetMap = new WeakMap();
var activeEffect;

function effect(fn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _effect = function _effect() {
    activeEffect = _effect;
    return fn.apply(void 0, arguments);
  };
  /* computed相关 */


  if (!options.lazy) {
    _effect();
  }

  _effect.active = true;
  _effect.options = options;
  return _effect;
}

function track(target, key) {
  var depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }

  var dep = depsMap.get(key);

  if (!dep) {
    depsMap.set(key, dep = new Set());
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}

function trigger(target, key) {
  var depsMap = targetMap.get(target);
  if (!depsMap) return;
  var effects = new Set();
  depsMap.get(key).forEach(function (e) {
    return effects.add(e);
  });
  effects.forEach(function (e) {
    return scheduleRun(e);
  });
}

function scheduleRun(effect) {
  if (effect.options.scheduler !== void 0) {
    effect.options.scheduler();
  } else {
    effect();
  }
}

function reactive(target) {
  return new Proxy(target, {
    get: function get(target, prop) {
      track(target, prop);
      return Reflect.get(target, prop);
    },
    set: function set(target, prop, newVal) {
      Reflect.set(target, prop, newVal);
      trigger(target, prop);
      /* 
        必须 return true;
        否则会产生警告 'set' on proxy: trap returned falsish for property
      */

      return true;
    }
  });
}

function ref(target) {
  var value = target;
  var obj = {
    get value() {
      track(obj, 'value');
      return value;
    },

    set value(newVal) {
      if (newVal !== value) {
        value = newVal;
        trigger(obj, 'value');
      }
    }

  };
  return obj;
}

function computed(fn) {
  var dirty = true;
  var value;
  var runner = effect(fn, {
    lazy: true,
    scheduler: function scheduler() {
      dirty = true;
    }
  });
  return {
    get value() {
      if (dirty) {
        dirty = false;
        value = runner();
      }

      return value;
    }

  };
}
},{}],"../src/core/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateRender = templateRender;
exports.render = render;

var _base = require("../utils/base.js");

var _reactive = require("./reactive");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cursor = 0;
var effectHooks = [];

function templateRender(instance, dom) {
  (0, _reactive.effect)(function () {
    instance.$data && innerDom(dom, instance);
  });
  instance.$data = instance.setup();
  innerDom(instance, dom);
}

function innerDom(instance, dom) {
  dom.innerHTML = instance.render();
}

function render(vnode, dom) {
  var oldDom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : dom.firstChild;
  diff(vnode, dom, oldDom);
}

var diff = function diff(vnode, dom, oldDom) {
  // 获得在创建元素是的vnode
  var oldVnode = oldDom && oldDom.vnode;

  if (!oldDom) {
    mount(vnode, dom, oldDom);
  } else if ((0, _base.isFn)(vnode.type)) {
    diffComponent(vnode, null, dom, oldDom);
  } else if (oldVnode && oldVnode.type === vnode.type) {
    diffElement(oldDom, vnode, oldVnode);
  } else {
    // TODO: 
    console.log('不值得比较了');
  }
};

var diffComponent = function diffComponent(vnode, oldVnode, dom, oldDom) {
  if (!oldVnode) {
    mount(vnode, dom, oldDom);
  }
};

var diffElement = function diffElement(oldDom, vnode, oldVnode) {
  if (oldVnode.type === 'text') {
    updateTextNode(oldDom, vnode, oldVnode);
  } else {
    updateElement(oldDom, vnode, oldVnode);
  }

  oldDom.vnode = vnode;
  vnode.props.children.forEach(function (child, i) {
    // children:只包含元素节点
    // childNodes:包含所有类型的节点
    // 这时需要在h函数中剔除undefined元素
    diff(child, oldDom, oldDom.childNodes[i]);
  }); // 试图剔除多余节点 childNodes

  var oldChildNodes = oldDom.childNodes;
  var oldMaxIndex = oldChildNodes.length - 1;
  var vnodeMaxIndex = vnode.props.children.length - 1; // 剔除多余节点

  if (oldMaxIndex > vnodeMaxIndex) {
    // 从后面开始删除，保证index顺序
    for (var i = oldMaxIndex; i > vnodeMaxIndex; i--) {
      unmountNode(oldDom, oldChildNodes[i]);
    }
  }
};

var mount = function mount(vnode, dom, oldDom) {
  if ((0, _base.isFn)(vnode.type)) {
    return mountComponent(vnode, dom, oldDom);
  } else {
    console.log(vnode, 'mount vnode');
    return mountElement(vnode, dom, oldDom);
  }
};

var mountComponent = function mountComponent(vnode, dom, oldDom) {
  // resetHook(vnode, dom, oldDom);
  var nextVnode = vnode;

  while ((0, _base.isFn)(nextVnode.type)) {
    nextVnode = nextVnode.type(vnode.props || {});
  }

  return mount(nextVnode, dom, oldDom);
};

var mountElement = function mountElement(vnode, dom, oldDom, parent) {
  /*
    在 h 函数中已经将数组扁平化
    在处理 map 等jsx 的时候不需要再通过再次判断数组递归
  */
  var newDom = null;
  var nextSibiling = oldDom && oldDom.nextSibiling;

  if (vnode.type === 'text') {
    newDom = document.createTextNode(vnode.props.content);
  } else {
    newDom = document.createElement(vnode.type);
    updateElement(newDom, vnode);
  } // 生成元素的的时候顺便造一颗vnode树


  newDom.vnode = vnode;

  if (oldDom) {
    unmountNode(parent, oldDom);
  }

  if (nextSibiling) {
    dom.insertBefore(newDom, nextSibiling);
  } else {
    dom.appendChild(newDom);
  }

  vnode.props.children.forEach(function (child) {
    mount(child, newDom);
  });
};

var updateElement = function updateElement(dom, newVnode) {
  var oldVnode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var newProps = newVnode.props || {};
  var oldProps = oldVnode.props || {}; // 将新旧属性同时比较以减少遍历次数

  for (var name in _objectSpread(_objectSpread({}, oldProps), newProps)) {
    var oldValue = oldProps[name];
    var newValue = newProps[name];

    if (oldValue == newValue || name === 'children') {} else if (name === 'style') {// TODO: style
    } else if (name === 'className') {
      dom.setAttribute('class', newValue);
    } else if (name.startsWith('on')) {
      var eventName = name.slice(2).toLowerCase();
      if (oldValue) dom.removeEventListener(eventName, oldValue, false);
      dom.addEventListener(eventName, newValue, false);
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, newValue);
    }
  }
};

var updateTextNode = function updateTextNode(dom, newVnode) {
  var oldVnode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (newVnode.props.content !== oldVnode.props.content) {
    dom.textContent = newVnode.props.content;
  }

  dom.vnode = newVnode;
};

var unmountNode = function unmountNode(dom, child) {
  child.remove();
};
},{"../utils/base.js":"../src/utils/base.js","./reactive":"../src/core/reactive.js"}],"../src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createElement", {
  enumerable: true,
  get: function () {
    return _h.createElement;
  }
});
Object.defineProperty(exports, "templateRender", {
  enumerable: true,
  get: function () {
    return _dom.templateRender;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _dom.render;
  }
});
Object.defineProperty(exports, "reactive", {
  enumerable: true,
  get: function () {
    return _reactive.reactive;
  }
});
Object.defineProperty(exports, "ref", {
  enumerable: true,
  get: function () {
    return _reactive.ref;
  }
});
Object.defineProperty(exports, "computed", {
  enumerable: true,
  get: function () {
    return _reactive.computed;
  }
});

var _h = require("./core/h.js");

var _dom = require("./core/dom.js");

var _reactive = require("./core/reactive.js");
},{"./core/h.js":"../src/core/h.js","./core/dom.js":"../src/core/dom.js","./core/reactive.js":"../src/core/reactive.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _index = require("../src/index.js");

// const setupApp = {
//   $data: null,
//   setup () {
//     let count = reactive({ num: 0 })
//     let num = ref(233);
//     setInterval(() => {
//       count.num += 1;
//       num.value += 1;
//     }, 1000);
//     let name = computed(() => {
//       return count.num + 'Mokou'
//     })
//     return {
//       count,
//       num,
//       name
//     };
//   },
//   render() {
//     return `<div>
//       <button>${this.$data.count.num}</button>
//       <span>${this.$data.num.value}</span>
//       <div>
//         <span>${this.$data.name.value}</span>
//       </div>
//     </div>`
//   }
// }
// templateRender(setupApp, document.querySelector('#setup'));
function TestItem() {
  return (0, _index.createElement)("div", {
    className: "test"
  }, "test");
}

function JsxApp() {
  var count = (0, _index.reactive)({
    num: 0
  });
  var num = (0, _index.ref)(233);

  var addCount = function addCount() {
    count.num += 1;
  };

  return (0, _index.createElement)("div", {
    className: "abc"
  }, (0, _index.createElement)("button", {
    onclick: addCount
  }, count.num), (0, _index.createElement)(TestItem, null), num.value);
}

(0, _index.render)((0, _index.createElement)(JsxApp, null), document.querySelector('#functional'));
},{"../src/index.js":"../src/index.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52425" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map