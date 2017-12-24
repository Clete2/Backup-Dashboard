// All links-related publications

import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import Results from '../results.js';

Meteor.publish(
  'results.all', function () {
    return Results.find();
  },
  { httpMethod: 'GET', url: '/api/results' },
);

Meteor.publish('results.latestByComputerAndDestination', function () {
  ReactiveAggregate(
    this, Results,
    [
      { $match: { end: { $exists: true } } },
      { $sort: { end: 1 } },
      {
        $group: {
          _id: { computer: '$computer', destination: '$destination' },
          end: { $last: '$end' },
          id: { $last: '$_id' },
        },
      }, {
        $project: {
          _id: '$id', computer: '$_id.computer', destination: '$_id.destination', end: '$end',
        },
      }],
  );
});
