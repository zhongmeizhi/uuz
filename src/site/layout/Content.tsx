import React from 'react';
import { renderRoutes, matchRoutes } from "react-router-config";
import { Link } from "react-router-dom";

import { Layout, ZHeader, NavBody } from './content.style';

export default function Content({route, location}: any) {
    const branch = matchRoutes(route.routes, location.pathname);
    const name = (branch && branch[0] && branch[0].route.name) || '';
    return <Layout>
        <ZHeader>
            <Link to="/"><img src={require('./house.svg')} alt="house"></img></Link>
            <p>{name}</p>
        </ZHeader>
        <NavBody>
            {renderRoutes(route.routes)}
        </NavBody>
    </Layout>
}