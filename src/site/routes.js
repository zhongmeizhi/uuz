import React, { lazy, Suspense } from 'react';
import { Redirect } from "react-router-dom";

const SuspenseComponent = (Component) => (props) => {
	return (
		<Suspense fallback={null}>
			<Component {...props}></Component>
		</Suspense>
	)
}

export default [
	{
		path: "/",
		exact: true,
		component: SuspenseComponent(lazy(() => import('./pages/button'))),
	},
	{
		path: "/components",
		render: () => <Redirect to={"/components/button"} />,
		routes: [
			{
				path: "/components/button",
				component: SuspenseComponent(lazy(() => import('./pages/button'))),
			}
		]
	},
	// {
	// 	path: "/:name",
	// 	component: SuspenseComponent(lazy(() => import('./pages/button'))),
	// 	routes: [
	// 		{
	// 			path: "/:name/page",
	// 			component: SuspenseComponent(lazy(() => import('./pages/button'))),
	// 		}
	// 	]
	// }
];