import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const MetaTags = ({ title, description, keywords, url, image, type }) => (
  <Head>
    <title>
      {title ? `${title} | ` : ''} HCL Volt MX Tutorials
    </title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={type} />
    {url ? <meta property="og:url" content={url} /> : null}
    {image ? <meta property="og:image" content={image} /> : null}
    {keywords ? <meta name="keywords" content={keywords} /> : null}
  </Head>
);

MetaTags.defaultProps = {
  title: 'HCL Volt MX Tutorials',
  description:
    'The HCL Volt MX Tutorials allows you to explore, use and contribute components, patterns, services and adapters to quickly design and build apps for a broad range of use cases.',
  type: 'website',
};

MetaTags.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string
};

export default MetaTags;
