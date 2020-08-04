
function htmlPlugin({ app, fs }) {
	app.use(async (ctx, next) => {
		const { request: { path } } = ctx;
		// 首页
		if (path == '/') {
			ctx.type = "text/html"
			ctx.body = fs.readFileSync('./index.html', 'utf-8')
		} else {
			return next();
		}
	})
}

module.exports = htmlPlugin;