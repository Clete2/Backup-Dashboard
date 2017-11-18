const computerRegex = /Computer:\n(.*?)\n/;
const userRegex = /User:\n(.*?)\n/;
const destinationRegex = /Destination:\n(.*?)\n/;
const folderStartEndScannedUploadedRegex = /Folder\nStart Date\nEnd Date\nScanned\nUploaded\n\n(.+?)\n(.+?)\n(.+?)\n(.+?)\n(.+?)\n/;

export const canParse = text => text !== null && (!!text.match(/\barq\b/i));

// Matches and returns all groups except the first (whole match) group
const match = (regex, text) => {
  const matchResult = text ? regex.exec(text) : null;

  return matchResult && matchResult.length > 1 ? matchResult.slice(1) : null;
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
    [result.folder, result.start, result.end, result.scanned, result.uploaded] = statMatch;
  }

  return result;
};

export default parse;
