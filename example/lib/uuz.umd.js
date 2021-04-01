(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.uuz = factory());
}(this, (function () { 'use strict';

	function h(Component, data, ...children) {
	  const geometry = new Component(data);
	}

	const uuz = {
	  h
	};

	return uuz;

})));
