import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import Results from './results.js';

if (Meteor.isServer) {
  describe('results collection', function () {
    it('insert correctly', function () {
      const resultId = Results.insert({});
      const added = Results.find({ _id: resultId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'results');
      assert.equal(count, 1);
    });
  });
}
