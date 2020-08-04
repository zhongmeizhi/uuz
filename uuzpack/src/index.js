const uuzPlugin = require('./uuzPlugin')
const htmlPlugin = require('./htmlPlugin')
const jsPlugin = require('./jsPlugin')
const cssPlugin = require('./cssPlugin')
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const app = new Koa();

const resolve = (p) => {
	return path.resolve(__dirname, '..', p);
}

function rewriteImport(content) {
	return content.replace(/from ['"]([^'"]+)['"]/g, function (s0, s1) {
		// . ../ /开头的，都是相对路径
		if (s1[0] !== '.' && s1[1] !== '/') {
			return `from '/@modules/${s1}'`
		} else {
			return s0
		}
	})
}

const resolvedPlugins = [
	uuzPlugin,
	htmlPlugin,
	jsPlugin,
	cssPlugin,
]

const context = {
	app,
	fs,
	resolve,
	uuzPath: "../uuz.esm.js", // TODO: 待发布后改成npm方式，并且uuzpack需要支持引入外部包
	rewriteImport
}

resolvedPlugins.forEach((m) => m && m(context, rewriteImport))

app.listen(3000)