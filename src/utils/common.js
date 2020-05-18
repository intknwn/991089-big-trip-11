import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const getDateTime = (date, isReversed = false) => {
  const dateString = moment(date).format(`DD/MM/YYYY`);
  const dateStringReversed = moment(date).format(`YYYY/MM/DD`);

  return isReversed ? dateString : dateStringReversed;
};

export const getDuration = (startDate, endDate) => {
  const date1 = moment(startDate);
  const date2 = moment(endDate);
  const duration = moment.duration(date2.diff(date1));

  return duration;
};

export const getFormattedDuration = (startDate, endDate) => {
  return getDuration(startDate, endDate).format(`d[D] h[H] m[M]`, {trim: `all`});
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

export const addDayProperty = (events) => {
  const obj = createSortedByDateObject(events);

  return Object.keys(obj)
    .sort()
    .reduce((acc, date, i) => {
      obj[date].forEach((event) => {
        event.day = i + 1;
      });

      return [...acc, ...obj[date]];
    }, []);
};

export const findDestination = (destinations, name) => {
  return destinations.find((destination) => destination.name === name);
};

export const findOffers = (offers, type) => {
  return offers.find((offer) => offer.type === type);
};
