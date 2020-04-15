import {createEventItemTemplate} from './event-item.js';
import {getDateTime} from '../util.js';
import {months} from '../const.js';
import {createEventFormTemplate} from './event-form.js';


const createSortedDaysObject = (events) => {
  return events.reduce((acc, event) => {
    const date = getDateTime(event.startDate);
    const arr = acc[date] ? [...acc[date], event] : [event];

    return Object.assign(acc, {[date]: arr});
  }, {});
};

const createEventFormOnce = ((cb1, cb2) => {
  let once = false;
  return (event) => {
    if (!once) {
      once = true;
      return cb1(event, false);
    } else {
      return cb2(event);
    }
  };
})(createEventFormTemplate, createEventItemTemplate);

const createEventItemsTemplate = (events) =>
  events.map((event) => {
    return createEventFormOnce(event);
  }).join(`\n`);

const createDayItemsTemplate = (dateObject) => {
  const sortedDateKeys = Object.keys(dateObject).sort();

  return sortedDateKeys.reduce((acc, date, index) => {
    const day = new Date(date).getDate();
    const monthNumber = new Date(date).getMonth();

    return [...acc, (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${index + 1}</span>
          <time class="day__date" datetime="${date}">${months[monthNumber]} ${day}</time>
        </div>
        <ul class="trip-events__list">${createEventItemsTemplate(dateObject[date])}</ul>
      </li>`
    )];
  }, []);
};

export const createTripDaysTemplate = (events) => {
  const sortedByDateObj = createSortedDaysObject(events);
  return (
    `<ul class="trip-days">
      ${createDayItemsTemplate(sortedByDateObj).join(`\n`)}
    </ul>`
  );
};
