import AbstractSmartComponent from './abstract-smart-component.js';

export const createMessageTemplate = (message, isErrorMessage) => {
  const errorClass = isErrorMessage ? `trip-events__msg--error` : ``;
  return `<p class="trip-events__msg ${errorClass}">${message}</p>`;
};

export default class Message extends AbstractSmartComponent {
  constructor() {
    super();
    this._message = ``;
    this._isErrorMessage = false;
  }

  getTemplate() {
    return createMessageTemplate(this._message, this._isErrorMessage);
  }

  createLoadingMessage() {
    this._message = `Loading...`;
    super.rerender();
  }

  createNoEventsMessage() {
    this._message = `Click New Event to create your first point`;
    super.rerender();
  }

  createDestinationsErrorMessage() {
    this._message = `Couldn't load destinations.<br>Try to reload the page.`;
    this._isErrorMessage = true;
    super.rerender();
  }

  createOffersErrorMessage() {
    this._message = `Couldn't load offers.<br>Try to reload the page.`;
    this._isErrorMessage = true;
    super.rerender();
  }

  recoveryListeners() {}
}
