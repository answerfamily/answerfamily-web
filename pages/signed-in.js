import { Component } from 'react';
import { parseHash } from '../lib/auth0';
import { followLoginRedirect, setToken } from '../lib/auth';

class SignedInPage extends Component {
  componentDidMount() {
    parseHash((err, result) => {
      if (err) {
        console.error('Something happened with the Sign In request');
        return;
      }

      setToken(result.idToken, result.accessToken);
      followLoginRedirect();
    });
  }

  render() {
    return <p>Redirecting back...</p>;
  }
}

export default SignedInPage;
