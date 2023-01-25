import React from 'react';
import { Provider } from 'react-redux';
import Script from 'next/script';
import { useStore } from '~/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useRouter } from 'next/router';
import algoliasearch from 'algoliasearch';
import { InstantSearch } from 'react-instantsearch-dom';
import { ROUTES } from '~/utils/routes';
import Head from 'next/head';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as gtag from '~/utils/gtag';
import { DefaultSeo } from 'next-seo';

import Header from '~/components/Header';
import ListHeader from '~/components/ListHeader';
import Footer from '~/components/Footer';
import MobileFooter from '~/components/MobileFooter';

import '~/styles/global.scss';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';

const App = props => {
  const { Component, pageProps } = props;
  const router = useRouter();
  const store = useStore(pageProps.initialReduxState);

  const algolia_client_id = process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID;
  const algolia_client_secret = process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_SECRET;
  const algolia_index_name = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
  const searchClient = algoliasearch(algolia_client_id, algolia_client_secret);
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

  const SEO = {
    openGraph: {
      type: 'website',
      locale: 'en_IE',
      url: 'https://recom.estate',
      site_name: 'RECOM',
    },
    twitter: {
      handle: '@handle',
      site: '@site',
      cardType: 'summary_large_image',
    },
  };

  const httpLink = createHttpLink({
    uri: graphqlEndpoint,
  });

  const authLink = setContext((_, { headers }) => {
    const token = store.getState().app.fbToken;

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const isHome = () => {
    return router.pathname === ROUTES.HOME;
  };

  const noFooter = () => {
    return (
      router.pathname === ROUTES.LIST ||
      router.pathname === ROUTES.LISTING_ADD ||
      router.pathname === ROUTES.PROPERTIES ||
      router.pathname === ROUTES.AGENT ||
      router.pathname === ROUTES.LIVE ||
      router.pathname === ROUTES.CONTACT
    );
  };

  const MainContent = () => (
    <InstantSearch indexName={algolia_index_name} searchClient={searchClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
        <meta name="google-site-verification" content="Mt_Iu_7krroUNIQusTG_a_ryBURhHfBwA5g_rrqQSb4" />
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
        <link rel="shortcut icon" href="/static/favicon.ico" />
        <Script
          id="gtag-init"
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <Script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="HYroLmmBDYfuwv2CBBraKDQYa98FXyVb";;analytics.SNIPPET_VERSION="4.15.3";
              analytics.load("HYroLmmBDYfuwv2CBBraKDQYa98FXyVb");
              analytics.page();
              }}();
            `,
          }}
        />
      </Head>
      <ApolloProvider client={client}>
        <MobileFooter />
        {isHome() ? <Header /> : <ListHeader />}
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
        {!noFooter() && <Footer />}
      </ApolloProvider>
    </InstantSearch>
  );

  return process.browser ? (
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.__PERSISTOR}>
        <MainContent />
      </PersistGate>
    </Provider>
  ) : (
    <Provider store={store}>
      <MainContent />
    </Provider>
  );
};

export default App;
