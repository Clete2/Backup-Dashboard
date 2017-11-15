import { Meteor } from 'meteor/meteor';
// eslint-disable-next-line import/no-unresolved
import { assert } from 'meteor/practicalmeteor:chai';
import { canParse, parse } from './arq-email-parser';


if (Meteor.isServer) {
  describe('arq email parser', () => {
    it('can parse a report with the word arq in it', function () {
      assert.isTrue(canParse('Arq'));
    });

    it('cannot parse an empty report', () => {
      assert.isFalse(canParse(''));
    });

    it('cannot parse a CrashPlan result', () => {
      assert.isFalse(canParse('CrashPlan'));
    });

    it('cannot parse a null result', () => {
      assert.isFalse(canParse(null));
    });
  });
}
