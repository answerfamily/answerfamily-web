import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { authorize, logout } from '../../lib/auth0';
import { dehydrate, setLoginRedirect } from '../../lib/auth';

const ME = gql`
  {
    me {
      id
      name
    }
  }
`;

/**
 * Function-as-child component
 *
 * children: ({loading, error, me, authorize}) => ReactComponent
 */
function RequireLogin({ children }) {
  return (
    <Query query={ME}>
      {({ loading, error, data, client }) =>
        children({
          loading,
          error,
          me: data ? data.me : null,
          authorize: () => {
            setLoginRedirect();
            dehydrate(client);
            authorize();
          },
          deauthorize: () => {
            setLoginRedirect();
            logout();
          },
        }) || null // ensure return null when render nothing
      }
    </Query>
  );
}

export default RequireLogin;
