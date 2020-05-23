import AbstractComponent from './abstract-component.js';

export const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class TripDaysList extends AbstractComponent {

  getTemplate() {
    return createTripDaysTemplate();
  }
}

