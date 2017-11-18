import { Meteor } from 'meteor/meteor';
// eslint-disable-next-line import/no-unresolved
import { assert } from 'chai';
import parse from './arq-date-parser';

const estDate = 'November 9, 2017 at 7:29:02 PM EST';
const edtDate = 'November 9, 2017 at 7:29:02 PM EDT';

if (Meteor.isServer) {
  describe('arq date parser util', () => {
    it('can parse a valid arq formatted date', () => {
      assert.equal('Fri, 10 Nov 2017 00:29:02 GMT', parse(estDate).toUTCString());
    });

    it('can parse an edt date', () => {
      assert.equal('Fri, 10 Nov 2017 00:29:02 GMT', parse(edtDate).toUTCString());
    });

    it('can parse an asian date but not with a specific timezone', () => {
      assert.equal('Thu, 09 Nov 2017 19:29:02 GMT', parse('November 9, 2017 at 7:29:02 PM KST').toUTCString());
    });

    it('returns null if it cannot find a date', () => {
      assert.equal(null, parse('not a date'));
      assert.equal(null, parse(''));
      assert.equal(null, parse(null));
      assert.equal(null, parse(undefined));
    });
  });
}
