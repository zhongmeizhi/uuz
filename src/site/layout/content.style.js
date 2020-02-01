import styled from 'styled-components';

export const Layout = styled.div`
    max-width: 456px;
    margin: auto;
`

export const ZHeader = styled.div`
    padding-left: 50px;
    line-height: 50px;
    border-bottom: 1px solid #108ee9;
    color: grey;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 6;
    background: #f5f5f9;
    img {
        position: absolute;
        top: 9px;
        left: 9px;
        width: 32px;
        height: 32px;
    }
    p {
        font-size: 18px;
    }
`

export const NavBody = styled.div`
    padding-top: 50px;
`

export const ZBody = styled.div`
    padding: 16px;
`
