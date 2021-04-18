/**
 * @param {number} i
 * @returns {string}
 */
const formatNumber = (i) => {
  // add a zero in front of numbers<10
  if (i < 10) {
    i = `0${i}`;
  }
  return i;
};
/**
 * @returns {string}
 */
export const getTime = () => {
  let today = new Date();
  let h = formatNumber(today.getHours());
  let m = formatNumber(today.getMinutes());

  return `${h}:${m}`;
};
/**
 * @returns {string}
 */
export const getDate = () => {
  let today = new Date();
  let d = formatNumber(today.getDate());
  let m = formatNumber(today.getMonth() + 1);
  let y = today.getFullYear();

  return `${d}/${m}/${y}`;
};
/**
 * @param {string} date1
 * @param {string} date2
 * @returns {boolean}
 */
export const isBiggerThan = (date1, date2) => {
  date1 = date1.split("/");
  date2 = date2.split("/");
  let a = new Date(date1[2], date1[1] - 1, date1[0]);
  let b = new Date(date2[2], date2[1] - 1, date2[0]);

  return a.getTime() > b.getTime();
};
/**
 * @param {array} flags
 * @returns {boolean}
 */
export const isExceeded = (flags) => {
  return flags.includes("character-limit-exceeded");
};
export const isResultNotFound = (flags) => {
  return flags.includes("no-results");
};
/**
 * @param {array} conversation
 * @param {array} flags
 * @returns {boolean}
 */
export const lastTwoAreNotFound = (conversation, flags) => {
  // at this point .length - 1 is the user message
  // so we need length -2 to get chatbot msg

  return (
    conversation[conversation.length - 2].notFound &&
    flags.includes("no-results")
  );
};
/**
 * @param {array} films
 * @returns {string}
 */
export const setFilmsList = (films) => {
  let msg = `The <strong>force</strong> is in this movies:
                <ul>`;
  films.forEach(
    (film) => (msg += `<li class="flex relative left-4">- ${film}</li>`)
  );
  msg += `</ul>`;
  return msg;
};
/**
 * @param {array} characters
 * @returns {string}
 */
export const setCharactersList = (characters) => {
  let msg = `I haven't found any results, but here is a list of some Star Wars characters:
                <ul>`;
  characters.forEach(
    (film) => (msg += `<li class="flex relative left-4">- ${film}</li>`)
  );
  msg += `</ul>`;
  return msg;
};
