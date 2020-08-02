const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

const reslove = (p) => {
	return path.resolve(__dirname, '..', p);
}

// TODO: 待发布后改成npm方式，并且uuzpack需要支持引入外部包
const uuzPath = "../uuz.esm.js";

const app = new Koa()

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

app.use(async ctx => {
	const { request: { url, query: { type } } } = ctx;
	// 首页
	if (url == '/') {
		ctx.type = "text/html"
		ctx.body = fs.readFileSync('./index.html', 'utf-8')
	} else if (url.endsWith('.js')) {
		// js文件
		const p = reslove(url.slice(1));
		ctx.type = 'application/javascript'
		const content = fs.readFileSync(p, 'utf-8')
		ctx.body = rewriteImport(content)
	} else if (url.indexOf('.uuz') > -1) {
		// uuz单文件组件
		const p = reslove(url.split('?')[0].slice(1))
		const { descriptor } = compilerSfc.parse(fs.readFileSync(p, 'utf-8'))

		if (!type) {
			ctx.type = 'application/javascript'
			ctx.body = `
      	// option组件
				${rewriteImport(descriptor.script.content.replace('export default ', 'const __script = '))}
				import { render as __render } from "${url}?type=template"
				__script.render = __render
				export default __script
      `
		} else if (type === 'template') {
			// 模板内容
			const template = descriptor.template;
			// 要在server端吧compiler做了
			const render = compilerDom.compile(template.content, { mode: "module" }).code
			const hackRender = render.replace(`from "vue"`, `from "${uuzPath}"`);
			ctx.type = 'application/javascript'
			ctx.body = rewriteImport(hackRender);
		}
	} else if (url.endsWith('.css')) {
		const p = resolve(url.slice(1))
		const file = fs.readFileSync(p, 'utf-8')
		const content = `const css = "${file.replace(/\n/g, '')}"
		  let link = document.createElement('style')
		  link.setAttribute('type', 'text/css')
		  document.head.appendChild(link)
		  link.innerHTML = css
		  export default css
		`
		ctx.type = 'application/javascript'
		ctx.body = content
	}

})



app.listen(3000, () => {
	console.log('蜗牛老湿是真的皮...')
})