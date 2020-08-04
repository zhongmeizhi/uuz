
function jsPlugin({ app, fs, resolve, rewriteImport }) {
	app.use(async (ctx, next) => {
		const { request: { path } } = ctx;
		if (path.endsWith('.js')) {
			// js文件
			const p = resolve(path.slice(1));
			ctx.type = 'application/javascript'
			const content = fs.readFileSync(p, 'utf-8')
			ctx.body = rewriteImport(content)
		} else {
			return next();
		}
	})
}

module.exports = jsPlugin;