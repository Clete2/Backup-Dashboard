import React, { Component } from 'react';
import ResultList from './ResultList.jsx';

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <div className="container">
        <header>
          <h1>Backup Dashboard</h1>
        </header>

        <ResultList />
      </div>
    );
  }
}
