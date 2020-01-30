import React from 'react';
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";

import routes from './routes';

import '../styles/index.scss';
import './test.scss';

function App() {
	return (
		<HashRouter>
			{renderRoutes(routes)}
		</HashRouter>
	);
}

export default App;
