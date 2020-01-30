import React, { lazy, Suspense } from 'react';
import { Redirect, Link } from "react-router-dom";

import Content from './layout/Content';
import { ZBody } from './layout/content.style';
import Gap from './layout/Gap';
import Button from '../views/Button'

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
	createNav('键盘', 'keyboard'),
	createNav('选择器', 'picker'),
	createNav('弹窗、确认框', 'popup'),
	createNav('滚动组件', 'scroll'),
	createNav('底部弹窗', 'sheet'),
	createNav('步骤条', 'step'),
	createNav('滑块', 'swiper'),
	createNav('开关', 'switch'),
	createNav('标签栏', 'tabs'),
	createNav('瀑布流', 'waterfall'),
]

const Home = function() {
	return <ZBody>
		<Gap>
			{
				navList.map(nav => <Link to={nav.path} key={nav.name} >
					<Button type="raw">{nav.name}</Button>
				</Link>)
			}
		</Gap>
	</ZBody>
}

export default [
	{
		name: '首页',
		path: '/',
		exact: true,
		component: Home,
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