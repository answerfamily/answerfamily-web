import App, { Container } from 'next/app';
import React from 'react';
import Head from 'next/head';
import withApolloClient from '../lib/with-apollo-client';
import { ApolloProvider } from 'react-apollo';
import CssBaseline from '@material-ui/core/CssBaseline';
import getPageContext from '../lib/getPageContext';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';

class MyApp extends App {
  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <Head>
          <title>我愛家・我解惑</title>
        </Head>
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            <CssBaseline />
            <ApolloProvider client={apolloClient}>
              <Component {...pageProps} />
            </ApolloProvider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
