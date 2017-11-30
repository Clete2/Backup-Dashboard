import { Meteor } from 'meteor/meteor';
// eslint-disable-next-line import/no-unresolved
import { assert } from 'chai';
import parse, { canParse } from './arq-email-parser';

const successResultText = 'Computer:\nmy MacBook Pro\n\nUser:\nme\n\nDestination:\nmy.example.com\n\n\n\n \n\nFolder\nStart Date\nEnd Date\nScanned\nUploaded\n\nme\nNovember 8, 2017 at 7:19:56 PM EST\nNovember 8, 2017 at 7:21:51 PM EST\n263.518 GB\n228.2 MB\n\n\n\n \n\n\nLog:\n\nArq Agent version 5.9.4 started backup session for sftp:\/\/backup@my.example.com:22\/rpool\/backup\/arq\/meMBP\/Some-GUID-HERE on November 8,2017 at 7:19:43 PM EST\n\n\nBackup session for \/Users\/me started on November 8, 2017 at 7:19:56 PM EST\nFound completed backup record for \/Users\/me\nSaved backup record for \/Users\/me\nScanned 263.518 GB (152147 files)\nUploaded 228.2 MB\nBackup session for \/Users\/me ended on November 8, 2017 at 7:21:51 PM EST\n\n\nBackup session for sftp:\/\/backup@my.example.com:22\/rpool\/backup\/arq\/meMBP\/Some-GUID-HERE ended on November 8, 2017 at 7:21:51 PM EST\n\n';
const errorResultText = 'Computer:\nmy MacBook Pro\n\nUser:\nme\n\nDestination:\nme.example.com\n\n\n\n \n\nFolder\nStart Date\nEnd Date\nScanned\nUploaded\n\nme\nNovember 9, 2017 at 7:29:02 PM EST\nNovember 10, 2017at 9:22:28 PM EST\n86.203 GB\n1.631 GB\n\n\n\n \n\n\nLog:\n\nArq Agent version 5.9.4 started backup session for sftp:\/\/backup@me.example.com:9482\/mnt\/backup\/arq\/me\/UUID-GOES-HERE on November 9, 2017 at 7:28:53 PM EST\n\n\nBackup session for \/Users\/me started on November 9, 2017 at 7:29:02 PM EST\nFound in-progress backup record for \/Users\/me\nSFTP server is unavailable.\n\nAborted.\n\nScanned 86.203 GB (40372 files)\nUploaded 1.631 GB\nBackup session for \/Users\/me ended on November 10, 2017 at 9:22:28 PM EST\n\n\nBackup session for sftp:\/\/backup@me.example.com:9482\/mnt\/backup\/arq\/me\/UUID-GOES-HERE ended on November 10, 2017 at 9:22:29 PM EST (1 error)\n\n';

if (Meteor.isServer) {
  describe('arq email parser canParse method', () => {
    it('can parse a report with the words arq agent in it', () => {
      assert.isTrue(canParse('Arq Agent'));
    });

    it('can parse a report with the words arq agent in it with additional spacing', () => {
      assert.isTrue(canParse(' Arq Agent '));
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

    it('cannot parse a result that does not have a standalone "Arq Agent"', () => {
      assert.isFalse(canParse('aarq agent'));
      assert.isFalse(canParse('arqA agent'));
    });

    it('can parse a result that has Arq Agent in the middle', () => {
      assert.isTrue(canParse('Hey this is an aRq agEnt report'));
    });

    it('can parse a real result with errors', () => {
      assert.isTrue(canParse(errorResultText));
    });

    it('can parse a real result without errors', () => {
      assert.isTrue(canParse(successResultText));
    });
  });

  describe('arq email parser parse method', () => {
    const assertSuccessErrorInvalid = (successExpected, errorExpected, propertyName) => {
      const successResult = parse(successResultText)[propertyName];
      const errorResult = parse(errorResultText)[propertyName];

      const successResultCasted = successResult instanceof Date ?
        successResult.toUTCString() : successResult;
      const errorResultCasted = errorResult instanceof Date ?
        errorResult.toUTCString() : errorResult;

      assert.equal(successExpected, successResultCasted);
      assert.equal(errorExpected, errorResultCasted);
      assert.notProperty(parse(''), propertyName);
      assert.notProperty(parse(null), propertyName);
      assert.notProperty(parse(undefined), propertyName);
    };

    it('Can determine the computer name', () => {
      const computerExpected = 'my MacBook Pro';
      assertSuccessErrorInvalid(computerExpected, computerExpected, 'computer');
    });

    it('Can determine the user name', () => {
      const userExpected = 'me';
      assertSuccessErrorInvalid(userExpected, userExpected, 'user');
    });

    it('Can determine the destination', () => {
      assertSuccessErrorInvalid('my.example.com', 'me.example.com', 'destination');
    });

    it('Can parse the folder', () => {
      const folderExpected = 'me';
      assertSuccessErrorInvalid(folderExpected, folderExpected, 'folder');
    });

    it('Can parse the start date', () => {
      assertSuccessErrorInvalid('Thu, 09 Nov 2017 00:19:56 GMT', 'Fri, 10 Nov 2017 00:29:02 GMT', 'start');
    });

    it('Can parse the end date', () => {
      assertSuccessErrorInvalid('Thu, 09 Nov 2017 00:21:51 GMT', 'Fri, 10 Nov 2017 05:00:00 GMT', 'end');
    });

    it('Can parse the scanned filesize', () => {
      assertSuccessErrorInvalid(282950297977, 92559766454, 'scanned');
    });

    it('Can parse the uploaded filesize', () => {
      assertSuccessErrorInvalid(239285043, 1751272915, 'uploaded');
    });

    it('Can determine if an error occured', () => {
      assertSuccessErrorInvalid(false, true, 'hasErrors');
    });

    it('Can parse the number of files scanned', () => {
      assertSuccessErrorInvalid(152147, 40372, 'filesScanned');
    });

    it('Can determine full backup text', () => {
      assertSuccessErrorInvalid(successResultText, errorResultText, 'text');
    });
  });
}
