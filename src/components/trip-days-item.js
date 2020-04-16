import {createElement} from '../util.js';
import {months} from '../const.js';

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

export default class TripDayItem {
  constructor(counter, date) {
    this._counter = counter;
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createTripDaysItemTemplate(this._counter, this._date);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
