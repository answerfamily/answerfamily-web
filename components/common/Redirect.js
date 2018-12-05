import { Component } from 'react';
import Router from 'next/router';

class Redirect extends Component {
  static defaultProp = {
    to: '',
  };

  componentDidMount() {
    const { to } = this.props;
    if (to) {
      Router.push(to);
    }
  }

  render() {
    return null;
  }
}

export default Redirect;
