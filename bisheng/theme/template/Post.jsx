import React from 'react';
import { Link } from 'bisheng/router';
import collect from 'bisheng/collect';
import { Helmet } from 'react-helmet-async';
import Layout from './Layout';

const Post = (props) => {
  const { pageData, utils, posts, name } = props;
  console.log(pageData, 'pageData')
  const { meta, description, content } = pageData;
  
  return (
    <Layout {...props}>
      <div className="layout-left">
        {
          posts.map(({meta}) => <div key={meta.filename}>
            <Link to={`/${meta.filename.replace(/\.md$/i, '')}`}>{meta.title}</Link>
          </div>)
        }
      </div>
      <div className="hentry">
        <Helmet>
          <title>{`${meta.title}`}</title>
          <meta name="description" content={description} />
        </Helmet>
        <h1 className="entry-title">{meta.title}</h1>
        {
          !description ? null :
            <div className="entry-description">{utils.toReactComponent(description)}</div>
        }
        <div>
          {/* <Child></Child> */}
        </div>
        <div className="entry-content">{utils.toReactComponent(content)}</div>
      </div>
    </Layout>
  );
}

export default collect(async (nextProps) => {
  if (!nextProps.pageData) {
    // eslint-disable-next-line no-throw-literal
    throw 404;
  }
  const pageData = await nextProps.pageData();
  const name = nextProps.params.sub;
  let posts = [];
  try {
    posts = nextProps.picked.posts;
  } catch (error) {
    console.error(error, 'posts')
  }
  return { pageData, posts, name };
})(Post);

// TODO
// {%- if config.disqus %}
// {%- include "_disqus.html" %}
// {%- endif %}
// {%- if config.duoshuo %}
// {%- include "_duoshuo.html" %}
// {%- endif %}
