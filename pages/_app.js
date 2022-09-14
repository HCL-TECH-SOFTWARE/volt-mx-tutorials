import React from 'react';
import Router, { withRouter } from 'next/router';
import App from 'next/app';
import { Provider } from 'react-redux';
import NProgress from 'nprogress';
import Head from 'next/head';
import getConfig from 'next/config';
import withReduxStore from '../src/store/createStore';
import Layout from '../src/components/Layout';
import { gtmId } from '../src/config/settings';
import GoogleTagManager from '../src/components/GoogleTagManager';
import i18next from '../i18n';

NProgress.configure({ showSpinner: false, minimum: 0.1 });
Router.events.on('beforeHistoryChange', () => NProgress.inc(0.5));
Router.events.on('routeChangeComplete', () => NProgress.done(true));
Router.events.on('routeChangeError', () => NProgress.done(true));
Router.events.on('routeChangeStart', () => {
  NProgress.inc(0.5);
  window.dataLayer.push({
    event: 'gtm.dom',
    timeOnPage: Math.abs(new Date().getTime() - localStorage.getItem('startTime')),
    prevPath: window.location.pathname,
  });
});

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { publicRuntimeConfig } = getConfig();
    const {
      Component, pageProps, router, store,
    } = this.props;
    const { asPath, pathname, query } = router;
    const url = { asPath, pathname, query };
    const searchParams = new URLSearchParams(asPath.split(/\?/)[1]);
    const lang = searchParams.get('lang');
    if (query && query.lang) {
      i18next.changeLanguage(query.lang);
    } else if (lang) {
      i18next.changeLanguage(lang);
    }

    return (
      <html lang="en">
        <Head>
          <title>HCL Volt MX Tutorials</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href={`${publicRuntimeConfig.asset}/static/dist/css/kony.css`} type="text/css" />
          <script src={`${publicRuntimeConfig.asset}/static/dist/js/visualizer.js`} className="next-head" />
        </Head>
        <GoogleTagManager gtmId={gtmId} />
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} url={url} />
          </Layout>
        </Provider>
      </html>
    );
  }
}

export default withReduxStore(withRouter(MyApp));
