import React, { lazy, Suspense } from 'react';
import { Redirect } from "react-router-dom";
import Content from './layout/Content';
import Home from './layout/Home';
import { upperCaseFirst } from '../utils/base'

const SuspenseComponent = (Component) => (props) => {
	return (
		<Suspense fallback={null}>
			<Component {...props}></Component>
		</Suspense>
	)
}

const createNav = function(name, path) {
	return {
		name: `${name} ${upperCaseFirst(path)}`,
		path: `/components/${path}`,
		component: SuspenseComponent(lazy(() => import(`./pages/${path}`))),
	}
}

const navList = [
	createNav('按钮', 'button'),
	createNav('勾选框', 'checkbox'),
	createNav('开关', 'switch'),
	createNav('标签栏', 'tabs'),
	createNav('弹窗、确认框', 'popup'),
	createNav('底部弹窗', 'sheet'),
	createNav('选择器', 'picker'),
	createNav('通知栏', 'notice'),
	createNav('步骤条', 'step'),
	createNav('键盘', 'keyboard'),
	createNav('滑块', 'swiper'),
	createNav('滚动组件', 'scroll'),
	createNav('瀑布流', 'waterfall'),
	createNav('未知瀑布流', 'trickle'),
]

export default [
	{
		name: '首页',
		path: '/',
		exact: true,
		component: () => Home(navList),
	},
	{
		name: '组件',
		path: "/components",
		component: Content,
		routes: [
			{
				path: "/components",
				exact: true,
				render: () => <Redirect to={"/components/button"} />
			},
			...navList
		]
	}
];