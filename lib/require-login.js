import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Component } from 'react';
import { authorize } from './auth0';

export const ME = gql`
  {
    me {
      id
    }
  }
`;

function requireLogin(Page) {
  return class RequireLogin extends Component {
    static displayName = `RequireLogin(${Page.displayName ||
      Page.name ||
      'Page'})`;

    static async getInitialProps(ctx) {
      if (Page.getInitialProps) {
        return await Page.getInitialProps(ctx);
      }

      return {};
    }

    handleLogin() {
      authorize();
    }

    render() {
      return (
        <Query query={ME}>
          {({ loading, error, data }) => {
            if (loading) {
              return <p>Checking authentication...</p>;
            }
            if (error) {
              return <p>Cannot fetch user.</p>;
            }
            if (!data || !data.me) {
              return (
                <div>
                  Please{' '}
                  <button type="button" onClick={this.handleLogin}>
                    login
                  </button>{' '}
                  to continue
                </div>
              );
            }

            return <Page {...this.props} />;
          }}
        </Query>
      );
    }
  };
}

export default requireLogin;
