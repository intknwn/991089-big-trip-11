import {FilterName} from '../const.js';
import moment from 'moment';

const getFutureEvents = (events) => {
  return events.filter((event) => moment(event.startDate).isAfter());
};

const getPastEvents = (events) => {
  return events.filter((event) => moment(event.endDate).isBefore());
};

export const getFilteredEvents = (events, filter) => {
  switch (filter) {
    case FilterName.EVERYTHING:
      return events;
    case FilterName.FUTURE:
      return getFutureEvents(events);
    case FilterName.PAST:
      return getPastEvents(events);
  }

  return events;
};

