import parseFilesize from 'filesize-parser';
import parseDate from './arq-date-parser';

const computerRegex = /Computer:\n(.*?)\n/;
const userRegex = /User:\n(.*?)\n/;
const destinationRegex = /Destination:\n(.*?)\n/;
const folderStartEndScannedUploadedRegex = /Folder\nStart Date\nEnd Date\nScanned\nUploaded\n\n(.+?)\n(.+?)\n(.+?)\n(.+?)\n(.+?)\n/;

export const canParse = text => text !== null && (!!text.match(/\barq\b/i));

// Matches and returns all groups except the first (whole match) group
const match = (regex, text) => {
  const matchResult = text ? regex.exec(text) : null;

  if (!matchResult) {
    return null;
  }

  const matchResultSliced = matchResult.slice(1);

  // Just return the data instead of a list with one element
  if (matchResultSliced.length === 1) {
    return matchResultSliced[0];
  }

  return matchResultSliced;
};

const assignPropertyIfPresent = (result, propertyName, value) => {
  Object.assign(result, value && { [propertyName]: value });
};

const parse = (text) => {
  const result = {};

  assignPropertyIfPresent(result, 'computer', match(computerRegex, text));
  assignPropertyIfPresent(result, 'user', match(userRegex, text));
  assignPropertyIfPresent(result, 'destination', match(destinationRegex, text));

  const statMatch = match(folderStartEndScannedUploadedRegex, text);

  if (statMatch) {
    const [folder, start, end, scanned, uploaded] = statMatch;

    assignPropertyIfPresent(result, 'folder', folder);
    assignPropertyIfPresent(result, 'start', parseDate(start));
    assignPropertyIfPresent(result, 'end', parseDate(end));
    assignPropertyIfPresent(result, 'scanned', parseFilesize(scanned));
    assignPropertyIfPresent(result, 'uploaded', parseFilesize(uploaded));
  }

  return result;
};

export default parse;
