// eslint-disable no-undef

import { Meteor } from 'meteor/meteor';
// eslint-disable-next-line import/no-unresolved
import { assert } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';
import ImapClient from 'emailjs-imap-client';
import MailReader from './MailReader';

if (Meteor.isServer) {
  describe('mailReader methods', function () {
    let mailReader;
    let connectStub;

    before(() => {
      mailReader = new MailReader('myemail@example.com', 'MyP4ssw0rd', 'imap.example.com');
      connectStub = sinon.stub(ImapClient.prototype, 'connect');
    });

    it('can create a MailReader', function () {
      assert.instanceOf(mailReader, MailReader);
    });

    it('can create a connection', function () {
      mailReader.connect();

      sinon.assert.calledOnce(connectStub);
    });

    after(() => {
      ImapClient.prototype.connect.restore();
    });
  });
}
