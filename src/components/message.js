import AbstractSmartComponent from './abstract-smart-component.js';

export const createMessageTemplate = (message, isErrorMessage) => {
  const errorClass = isErrorMessage ? `trip-events__msg--error` : ``;
  return `<p class="trip-events__msg ${errorClass}">${message}</p>`;
};

export default class Message extends AbstractSmartComponent {
  constructor() {
    super();
    this._text = ``;
    this._isError = false;
  }

  getTemplate() {
    return createMessageTemplate(this._text, this._isError);
  }

  createLoading() {
    this._text = `Loading...`;
    super.rerender();
  }

  createNoEvents() {
    this._text = `Click New Event to create your first point`;
    super.rerender();
  }

  createDestinationsError() {
    this._text = `Couldn't load destinations.<br>Try to reload the page.`;
    this._isError = true;
    super.rerender();
  }

  createOffersError() {
    this._text = `Couldn't load offers.<br>Try to reload the page.`;
    this._isError = true;
    super.rerender();
  }
}
