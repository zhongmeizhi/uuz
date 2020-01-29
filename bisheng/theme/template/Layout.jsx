import React from 'react';
import { Link } from 'bisheng/router';
import { HelmetProvider } from 'react-helmet-async';
import '../static/style';

export default ({ themeConfig, children, helmetContext = {} }) => {
  return (
    <HelmetProvider context={helmetContext}>
      <div>
        <div className="header">
          <div className="container">
            <div className="brand">
              <Link className="home" to={themeConfig.home}>{themeConfig.sitename}</Link>
              {
                !themeConfig.tagline ? null :
                  <span>- <span className="tagline">{themeConfig.tagline}</span></span>
              }
            </div>
            {
              !themeConfig.navigation ? null :
                <div className="menu" role="navigation">
                  {
                    themeConfig.navigation.map((item, index) =>
                      <Link to={item.link} key={index}>{item.title}</Link>
                    )
                  }
                </div>
            }
          </div>
        </div>
        <div className="document yue">
          {children}
        </div>
        <div className="footer">
          <p className="copyright">by <a href="https://github.com/zhongmeizhi">Mokou</a></p>
        </div>
        {
          !themeConfig.github ? null :
            <div className="github"><a className="github-link" href={themeConfig.github}>Start on GitHub</a></div>
        }
      </div>
    </HelmetProvider>      
  );
}
