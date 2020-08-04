
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

function uuzPlugin({ app, fs, resolve, uuzPath, rewriteImport }) {
	app.use(async (ctx, next) => {
		const { request: { path, query: { type } } } = ctx;
		if (path.endsWith('.uuz')) {
			// 利用 @vue/compiler-sfc 解析单文件组件
			const p = resolve(path.split('?')[0].slice(1))
			const { descriptor } = compilerSfc.parse(fs.readFileSync(p, 'utf-8'))
			if (!type) {
				ctx.type = 'application/javascript'
				ctx.body = `
					// option组件
					${rewriteImport(descriptor.script.content.replace('export default ', 'const __script = '))}
					import { render as __render } from "${path}?type=template"
					__script.render = __render
					export default __script
				`
			} else if (type === 'template') {
				// 模板内容
				const template = descriptor.template;
				// 利用 @vue/compiler-dom 解析template
				const render = compilerDom.compile(template.content, { mode: "module" }).code
				const hackRender = render.replace(`from "vue"`, `from "${uuzPath}"`);
				ctx.type = 'application/javascript'
				ctx.body = rewriteImport(hackRender);
			}
		} else {
			return next();
		}
	})
}

module.exports = uuzPlugin;