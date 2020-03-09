import React from 'react';
import { Link } from "react-router-dom";

import { ZBody } from '../layout/content.style';
import Gap from '../layout/Gap';
import Button from '../../views/Button'

export default function Home(navList: Array<any>) {
	return <ZBody>
		<h1>Z-UI</h1>
		<sub>一个 React + Hooks 写的UI库</sub>
		<Gap>
			{
				navList.map(nav => <Link to={nav.path} key={nav.name} >
					<Button type="raw">{nav.name}</Button>
				</Link>)
			}
		</Gap>
	</ZBody>
}
