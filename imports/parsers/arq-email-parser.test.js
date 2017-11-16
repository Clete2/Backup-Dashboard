import { Meteor } from 'meteor/meteor';
// eslint-disable-next-line import/no-unresolved
import { assert } from 'chai';
import parse, { canParse } from './arq-email-parser';

const errorResultText = 'Computer:\nmy MacBook Pro\n\nUser:\nme\n\nDestination:\nme.example.com\n\n\n\n \n\nFolder\nStart Date\nEnd Date\nScanned\nUploaded\n\nme\nNovember 9, 2017 at 7:29:02 PM EST\nNovember 10, 2017at 9:22:28 PM EST\n86.203 GB\n1.631 GB\n\n\n\n \n\n\nLog:\n\nArq Agent version 5.9.4 started backup session for sftp:\/\/backup@me.example.com:9482\/mnt\/backup\/arq\/me\/UUID-GOES-HERE on November 9, 2017 at 7:28:53 PM EST\n\n\nBackup session for \/Users\/me started on November 9, 2017 at 7:29:02 PM EST\nFound in-progress backup record for \/Users\/me\nSFTP server is unavailable.\n\nAborted.\n\nScanned 86.203 GB (40372 files)\nUploaded 1.631 GB\nBackup session for \/Users\/me ended on November 10, 2017 at 9:22:28 PM EST\n\n\nBackup session for sftp:\/\/backup@me.example.com:9482\/mnt\/backup\/arq\/me\/UUID-GOES-HERE ended on November 10, 2017 at 9:22:29 PM EST (1 error)\n\n';
const successResultText = 'Computer:\nmy MacBook Pro\n\nUser:\nme\n\nDestination:\nmy.example.com\n\n\n\n \n\nFolder\nStart Date\nEnd Date\nScanned\nUploaded\n\nme\nNovember 8, 2017 at 7:19:56 PM EST\nNovember 8, 2017 at 7:21:51 PM EST\n263.518 GB\n228.2 MB\n\n\n\n \n\n\nLog:\n\nArq Agent version 5.9.4 started backup session for sftp:\/\/backup@my.example.com:22\/rpool\/backup\/arq\/meMBP\/Some-GUID-HERE on November 8,2017 at 7:19:43 PM EST\n\n\nBackup session for \/Users\/me started on November 8, 2017 at 7:19:56 PM EST\nFound completed backup record for \/Users\/me\nSaved backup record for \/Users\/me\nScanned 263.518 GB (152147 files)\nUploaded 228.2 MB\nBackup session for \/Users\/me ended on November 8, 2017 at 7:21:51 PM EST\n\n\nBackup session for sftp:\/\/backup@my.example.com:22\/rpool\/backup\/arq\/meMBP\/Some-GUID-HERE ended on November 8, 2017 at 7:21:51 PM EST\n\n';

if (Meteor.isServer) {
  describe('arq email parser canParse method', () => {
    it('can parse a report with the word arq in it', () => {
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

    it('cannot parse a result that does not have a standalone "Arq"', () => {
      assert.isFalse(canParse('aarq'));
      assert.isFalse(canParse('arqA'));
    });

    it('can parse a result that has Arq in the middle', () => {
      assert.isTrue(canParse('Hey this is an aRq report'));
    });

    it('can parse a real result with errors', () => {
      assert.isTrue(canParse(errorResultText));
    });

    it('can parse a real result without errors', () => {
      assert.isTrue(canParse(successResultText));
    });
  });

  describe('arq email parser parse method', () => {
    it('Can determine the computer name in a valid result', () => {
      assert.equal('my MacBook Pro', parse(successResultText).computer);
    });

    it('Can determine the computer name in an errored result', () => {
      assert.equal('my MacBook Pro', parse(errorResultText).computer);
    });

    it('Cannot determine the computer name in an invalid result', () => {
      assert.notProperty(parse(''), 'computer');
    });

    it('Can determine the user name in a successful result', () => {
      assert.equal('me', parse(successResultText).user);
    });

    it('Can determine the user name in an errored result', () => {
      assert.equal('me', parse(errorResultText).user);
    });

    it('Cannot determine the user name in an invalid result', () => {
      assert.notProperty(parse(''), 'user');
    });
  });
}
