// All links-related publications

import { Meteor } from 'meteor/meteor';
import Results from '../results.js';

Meteor.publish(
  'results.all', function () {
    return Results.find();
  },
  { httpMethod: 'GET', url: '/api/results' },
);
