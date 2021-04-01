(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global['jsx-runtime'] = {}));
}(this, (function (exports) { 'use strict';

	function h(Component, data, ...children) {
	  const geometry = new Component(data);
	}

	const jsx = h;

	exports.default = h;
	exports.jsx = jsx;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
