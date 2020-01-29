import React from 'react';
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";

import routes from './routes';

import '../styles/index.scss';

// test
import Content from './layout/Content';

function App() {
	return (
		<HashRouter>
			<Content>
				{renderRoutes(routes)}
			</Content>
		</HashRouter>
	);
}

export default App;
