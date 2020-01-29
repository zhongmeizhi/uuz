import React from 'react';
import { Link } from "react-router-dom";

import { Layout, ZHeader, ZBody } from './content.style';

interface ContentProps {
    children: React.ReactNode
}

export default function Content({children}: ContentProps) {
    return <Layout>
        <ZHeader>
            <Link to="/"><img src={require('./house.svg')} alt="house"></img></Link>
            <p>头部</p>
        </ZHeader>
        <ZBody>
            {children}
        </ZBody>
    </Layout>
}