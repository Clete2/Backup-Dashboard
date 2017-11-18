import { Meteor } from 'meteor/meteor';
// eslint-disable-next-line import/no-unresolved
import { assert } from 'chai';
import sinon from 'sinon';
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

    it('sets the time to now if it cannot find a date', () => {
      const now = new Date();
      const sandbox = sinon.sandbox.create();
      const clock = sinon.useFakeTimers(now.getTime());

      assert.equal(now.toString(), parse('not a date').toString());
      assert.equal(now.toString(), parse('').toString());
      assert.equal(now.toString(), parse(null).toString());
      assert.equal(now.toString(), parse(undefined).toString());

      sandbox.restore();
      clock.restore();
    });
  });
}
