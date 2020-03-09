import React from 'react';

export default function EnterTip() {
	return <div className="test-enter-tip-box">
		<h3>这是一个移动端UI库</h3>
		<div className="test-tip-item">
			<p>使用了很多touch事件...(虽然兼容了PC端)</p>
			<p>若浏览器在<strong className="test-tip-strong">PC和Mobile间切换请刷新页面</strong>以重置事件...(实际使用场景中不可能出现该场景)</p>
		</div>
	</div>
}
