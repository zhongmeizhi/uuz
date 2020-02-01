import React from 'react';
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";

import routes from './routes';

import { Layout } from './layout/content.style';
import '../styles/index.scss';
import './test.scss';

function App() {
	return (
		<HashRouter>
			<Layout>
				{renderRoutes(routes)}
			</Layout>
		</HashRouter>
	);
}

export default App;
