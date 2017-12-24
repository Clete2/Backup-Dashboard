import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import filesize from 'filesize';

import Results from '../api/results/results';

class ResultList extends Component {
  columns() {
    const columns = [];

    Object.keys(this.props.results[0]).forEach((key) => {
      if (key === '_id' || key === 'text') {
        return;
      }
      columns.push({ Header: key, accessor: key });
    });

    return columns;
  }

  results() {
    const results = [];
    this.props.results.forEach((result) => {
      const resultMapped = {};

      // TODO: This is NOT the place to hardcode presentation logic
      Object.entries(result).forEach((entry) => {
        let newResult;
        console.log(result);

        if (typeof (entry[1]) === 'object') {
          newResult = entry[1].toString();
        } else if (entry[0] === 'uploaded' || entry[0] === 'scanned') {
          newResult = filesize(entry[1]);
        } else {
          newResult = entry[1];
        }

        resultMapped[entry[0]] = newResult;
      });

      results.push(resultMapped);
    });

    return results;
  }

  render() {
    if (this.props.results && this.props.results.length > 0) {
      return (
        <ReactTable data={this.results()} columns={this.columns()} />
      );
    }
    return (<h1>Loading!</h1>);
  }
}

export default withTracker(({ id }) => {
  const resultsHandle = Meteor.subscribe('results.latestByComputerAndDestination', id);
  const loading = !resultsHandle.ready();

  return {
    loading,
    results: Results.find().fetch(),
  };
})(ResultList);
