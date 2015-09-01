import React, { Component } from 'react';
import { connect } from 'react-redux';
import select from '../selectors/appSelector.js';


@connect(select)
export default class App extends Component {
  render() {
    return (
      <h1>Hello, world.</h1>
    );
  }
}
