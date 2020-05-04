import {months} from '../const.js';
import AbstractComponent from './abstract-component.js';

const createDayInfoTemplate = (counter, date) => {
  const monthDayString = `${new Date(date).getDate()} ${months[new Date(date).getMonth()]}`;

  return (`
    <span class="day__counter">${counter}</span>
    <time class="day__date" datetime="${date}">${monthDayString}</time>
  `);
};

const createTripDaysItemTemplate = (counter, date) => {
  const dayInfoTemplate = counter && date ? createDayInfoTemplate(counter, date) : ``;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfoTemplate}
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class TripDaysItem extends AbstractComponent {
  constructor(counter, date) {
    super();
    this._counter = counter;
    this._date = date;
  }

  getTemplate() {
    return createTripDaysItemTemplate(this._counter, this._date);
  }

  getEventsListElement() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
