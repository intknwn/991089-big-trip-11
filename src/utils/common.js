export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const getDateTime = (date, isReversed = false) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return isReversed ? `${castTimeFormat(day)}/${castTimeFormat(month)}/${year}` : `${year}-${castTimeFormat(month)}-${castTimeFormat(day)}`;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const createSortedByDateObject = (events) => {
  return events.reduce((acc, event) => {
    const date = getDateTime(event.startDate);
    const dateEvents = acc[date] ? [...acc[date], event] : [event];

    return Object.assign(acc, {[date]: dateEvents});
  }, {});
};

export const createPreposition = (eventType) => {
  if (eventType === `stop`) {
    return `in`;
  }

  return `to`;
};

export const makeFirstLetterUppercase = ([first, ...rest]) => [first.toUpperCase(), ...rest].join(``);