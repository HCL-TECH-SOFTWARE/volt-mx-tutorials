import _startCase from 'lodash/startCase';
import _toLower from 'lodash/toLower';
import moment from 'moment';

/**
 *  Truncates the string.
 * @private
 * @param {string} string - The string to truncate.
 * @param {number} length - The length of truncated string.
 * @returns {string} Returns truncated `string`.
 */

export const truncate = (string, length) => {
  if (typeof length !== 'number' || typeof string !== 'string') return string;
  if (string.length <= length) return string;
  if (length <= 3) return `${string.slice(0, length)}...`;
  return `${string.slice(0, length - 3)}...`;
};

/**
 *  Truncates the string without cutting words.
 * @private
 * @param {string} string - The string to truncate.
 * @param {number} length - The length of truncated string.
 * @returns {string} Returns truncated `string`.
 */

export const truncateAdvance = (string, length) => {
  if (typeof length !== 'number' || typeof string !== 'string') return string;
  if (string.length <= length) return string;
  return `${string.replace(new RegExp(`^(.{${length}}[^\\s]*).*`), '$1')}`;
};

/**
 *  Capitalize First Letter of the string.
 * @private
 * @param {string} string - The string whose first letter to be capitalized.
 * @returns {string} Returns string whose first letter is capital.
 */

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return null;
  }
  return _startCase(_toLower(string));
};

/**
 *  Get month name from the timestamp.
 * @private
 * @param {number} timestamp - The timestamp which is going to converted.
 * @returns {string} Returns month name from timestamp passed.
 */

export const getMonthNameFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const monthName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthName[date.getMonth()];
};

/**
 *  Get device os platform.
 * @private
 * @returns {string} Returns name of platform.
 */

let os = null;
if (process.browser) {
  const { userAgent, platform } = window.navigator;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod', 'iPhone Simulator', 'iPod Simulator', 'iPad Simulator'];
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }
}

export const getOS = os;

/**
 * Load a script.
 * @private
 * @param src of the file
 */

export const loadScript = (src) => {
  const tag = document.createElement('script');
  tag.src = src;
  tag.async = true;
  document.body.appendChild(tag);
};

export const validateData = (d) => {
  if (d) {
    if (typeof (d) === 'string' && d !== '') {
      return true;
    }
    if (typeof (d) === 'object' && Object.keys(d).length > 0) {
      return true;
    }
  }
  return false;
};

const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Replace all occurences of string with other.
 *
 * @private
 *
 * @param str, String to be replaced on.
 * @param term, term to be replaced.
 * @param replacement, String to be replaced with.
 */
export const replaceAll = (str, term, replacement) => str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);

/**
 * Convert number into two digits.
 *
 * @private
 *
 * @param number, Number to be converted.
 *
 * @return String, Number in two digits.
 */
function numberToTwoDigits(number) {
  return number > 9 ? `${number}` : `0${number}`;
}

/**
 * Convert seconds into HH:mm:ss time format.
 *
 * @private
 *
 * @param second, Number of seconds.
 *
 * @return String, time in the HH:mm:ss format.
 */
export const secondsToTime = (second) => {
  const seconds = parseInt(second, 10);
  const momentDuration = moment.duration(seconds, 'seconds');
  const hours = numberToTwoDigits(Math.floor(momentDuration.asHours()));
  const mins = numberToTwoDigits(momentDuration.minutes());
  const secs = numberToTwoDigits(momentDuration.seconds());
  return `${hours}:${mins}:${secs}`;
};
