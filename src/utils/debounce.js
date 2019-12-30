
// 防抖
function debounce (func, wait = 500, immediate = true) {
	let timer, context, args

	// 延迟执行函数
	const later = () => setTimeout(() => {
		// 内存清理
		timer = null

		if (!immediate) {
			// 后执行防抖
			// 使用到之前缓存的参数和上下文
			func.apply(context, args)

			// 清理内存
			context = args = null
		}
	}, wait)

	// 这里返回的函数是每次实际调用的函数
	return function(...params) {
		if (!timer) {
			// 如果没有setTimeout，就创建一个
			timer = later()

			if (immediate) {
				// 立即执行的防抖函数
				func.apply(this, params)
			} else {
				// 后执行的防抖函数
				// 缓存参数和调用上下文
				context = this
				args = params
			}
			
		} else {
			// 如果有setTimeout，那么重新计时
			clearTimeout(timer)
			timer = later()
		}
	}
}

export default debounce;
