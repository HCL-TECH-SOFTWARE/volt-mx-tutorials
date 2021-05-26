import Router, { withRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
import NProgress from 'nprogress';
import withReduxStore from '../src/store/createStore';
import Head from 'next/head';
import Layout from '../src/components/Layout';
import { gtmId } from '../src/config/settings';
import GoogleTagManager from '../src/components/GoogleTagManager';
import getConfig from 'next/config';
import nextI18NextConfig from '../next-i18next.config.js'
const { publicRuntimeConfig } = getConfig();

NProgress.configure({ showSpinner: false, minimum: 0.1 });
Router.events.on('beforeHistoryChange', () => NProgress.inc(0.5));
Router.events.on('routeChangeComplete', () => NProgress.done(true));
Router.events.on('routeChangeError', () => NProgress.done(true));
Router.events.on('routeChangeStart', () =>
  {
    NProgress.inc(0.5);
    window.dataLayer.push({
      'event': 'gtm.dom',
      'timeOnPage': Math.abs(new Date().getTime() - localStorage.getItem('startTime')),
      'prevPath': window.location.pathname
    });
  }
);

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, router, store } = this.props;
    const { asPath, pathname, query } = router;
    const url = { asPath, pathname, query };

    return (
      <html lang='en'>
        <Container>
          <Head>
            <title>HCL Volt MX Tutorials</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href={`${publicRuntimeConfig.asset}/static/dist/css/kony.css`} type="text/css" />
            <script src={`${publicRuntimeConfig.asset}/static/dist/js/visualizer.js`} className="next-head"></script>
          </Head>
          <GoogleTagManager gtmId={gtmId} />
          <Provider store={store}>
            <Layout>
              <Component {...pageProps} url={url} />
            </Layout>
          </Provider>
        </Container>
      </html>
    );
  }
}

export default appWithTranslation(withReduxStore(withRouter(MyApp)), nextI18NextConfig);
