// Tests for the results publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'meteor/practicalmeteor:chai';
import { Results } from '../results.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('results publications', function () {
  beforeEach(function () {
    Results.remove({});
    Results.insert({});
  });

  describe('results.all', function () {
    it('sends all results', function (done) {
      const collector = new PublicationCollector();
      collector.collect('results.all', (collections) => {
        assert.equal(collections.results.length, 1);
        done();
      });
    });
  });
});
