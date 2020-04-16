import {createElement} from '../util.js';

export const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class TripDaysList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDaysTemplate();
  }

  getElement() {
    if (!this.element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

