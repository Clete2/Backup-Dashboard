import moment from 'moment-timezone';

const tzMap = {
  EST: 'America/New_York',
  EDT: 'America/New_York',
  CDT: 'America/Chicago',
  CST: 'America/Chicago',
  MDT: 'America/Denver',
  MST: 'America/Denver',
  PST: 'America/Los_Angeles',
  PDT: 'America/Los_Angeles',
};

const parse = (date) => {
  if (!date) {
    return null;
  }

  const tzAbbr = date.slice(-3);
  const momentDate = moment.tz(date, 'MMMM DD, YYYY at hh:mm:ss A', tzMap[tzAbbr]);
  return momentDate.isValid() ? momentDate.toDate() : null;
};

export default parse;
