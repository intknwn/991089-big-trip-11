import {months} from '../const.js';
import AbstractComponent from './abstract-component.js';

const createTripDaysItemTemplate = (counter, date) => {
  const monthDayString = `${new Date(date).getDate()} ${months[new Date(date).getMonth()]}`;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${counter}</span>
        <time class="day__date" datetime="${date}">${monthDayString}</time>
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
