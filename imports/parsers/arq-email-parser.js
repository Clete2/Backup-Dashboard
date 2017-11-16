const computerRegex = /Computer:\n(.*?)\n/;
const userRegex = /User:\n(.*?)\n/;
const destinationRegex = /Destination:\n(.*?)\n/;
const folderStartEndScannedUploadedRegex = /Folder\nStart Date\nEnd Date\nScanned\nUploaded\n\n(.*?)\n(.*?)\n(.*?)\n(.*?)\n(.*?)\n/;

export const canParse = text => text !== null && (!!text.match(/\barq\b/i));

const match = (regex, text) => {
  const matchResult = regex.exec(text);

  return matchResult ? matchResult[1] : null;
};

const assignPropertyIfPresent = (result, propertyName, value) => {
  Object.assign(result, value && { [propertyName]: value });
};

const parse = (text) => {
  const result = {};

  assignPropertyIfPresent(result, 'computer', match(computerRegex, text));
  assignPropertyIfPresent(result, 'user', match(userRegex, text));

  return result;
};

export default parse;
