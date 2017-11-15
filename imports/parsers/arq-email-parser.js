const computerNameRegex = /Computer:\n(.*?)\n/;
const userNameRegex = /User:\\n(.*?)\\n/;
const destinationRegex = /Destination:\\n(.*?)\\n/;
const folderStartEndScannedUploadedRegex = /Folder\\nStart Date\\nEnd Date\\nScanned\\nUploaded\\n\\n(.*?)\\n(.*?)\\n(.*?)\\n(.*?)\\n(.*?)\\n/;

export const canParse = text => text !== null && (!!text.match(/\barq\b/i));

const parse = (text) => {
  const result = {};

  [, result.computer] = computerNameRegex.exec(text);

  return result;
};

export default parse;
