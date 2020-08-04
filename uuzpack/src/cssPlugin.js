
function cssPlugin({ app, fs, resolve }) {
	app.use(async (ctx, next) => {
		const { request: { path } } = ctx;
		if (path.endsWith('.css')) {
			const p = resolve(path.slice(1))
			const file = fs.readFileSync(p, 'utf-8')
			// 将css变成单行
			const css = JSON.stringify(file).replace(/\n/g, '');
			const content = `const css = ${css}
				let link = document.createElement('style')
				link.setAttribute('type', 'text/css')
				document.head.appendChild(link)
				link.innerHTML = css
				export default css
			`
			ctx.type = 'application/javascript'
			ctx.body = content
		} else {
			return next();
		}
	})
}

module.exports = cssPlugin;