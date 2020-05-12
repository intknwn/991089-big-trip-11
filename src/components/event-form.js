import {formatTime, getDateTime, createPreposition, makeFirstLetterUppercase} from '../utils/common.js';
import {findDestination, findOffers} from '../utils/common.js';
import {Mode as EventControllerMode} from '../controllers/event.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const events = {
  'taxi': `move`,
  'bus': `move`,
  'train': `move`,
  'ship': `move`,
  'transport': `move`,
  'drive': `move`,
  'flight': `move`,
  'check-in': `stop`,
  'sightseeing': `stop`,
  'restaurant': `stop`,
};

const createDestinationsTemplate = (destItems) => {
  return destItems.map(({name}) => `<option value="${name}"></option>`).join(`\n`);
};

const createOfferSelectorsTemplate = ({type, offers}) => {


  return offers.map((offer, counter) => {
    const {title, price} = offer;
    const checked = offer.checked ? `checked` : ``;

    return (
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${counter}" type="checkbox" name="event-offer-${type}" ${checked}>
          <label class="event__offer-label" for="event-offer-${type}-${counter}">
            <span class="event__offer-title">${title}</span>
            +
            €&nbsp;<span class="event__offer-price">${price}</span>
          </label>
        </div>`
    );
  }).join(`\n`);
};

const createOffersTemplate = (offersObject) => {
  const {offers} = offersObject;
  if (offers.length === 0) {
    return ``;
  }

  const offerSelectorsTemplate = createOfferSelectorsTemplate(offersObject);
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

      ${offerSelectorsTemplate}

      </div>
      </section>`
  );
};

const createImagesTemplate = (images) => {
  return images.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`).join(`\n`);
};

const createDestinationDescTemplate = (description, images) => {
  if (description) {
    const imagesTemplate = createImagesTemplate(images);

    return (
      `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${imagesTemplate}
        </div>
      </div>
    </section>`
    );
  } else {
    return ``;
  }
};

const createAddToFavoritesButtonTemplate = (favorite) => {
  const isChecked = favorite ? `checked` : ``;

  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isChecked}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createRollUpButtonTemplate = () => {
  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const createEventTypeItems = (eventNames, checkedEventName) => {
  return eventNames.map((eventName) => {
    const checked = eventName === checkedEventName ? `checked` : ``;
    const eventNameUpperCase = makeFirstLetterUppercase(eventName);

    return (
      `<div class="event__type-item">
      <input id="event-type-${eventName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventName}" ${checked}>
      <label class="event__type-label  event__type-label--${eventName}" for="event-type-${eventName}-1">${eventNameUpperCase}</label>
    </div>`
    );
  }).join(`\n`);
};

const createEventDetails = (offers, destination) => {
  if (offers || destination) {
    return (
      `<section class="event__details">
        ${offers}

        ${destination}
      </section>
    `);
  }

  return ``;
};

export const createEventFormTemplate = (eventItem, eventsModel, mode, {newEventName, newDestination}) => {
  const destinations = eventsModel.getDestinations();
  const modelOffers = eventsModel.getOffers();

  const isCreateMode = mode === EventControllerMode.CREATE ? true : false;
  const {eventName: name, destination: dest, images, startDate, endDate, price, isFavorite} = eventItem;
  const eventName = newEventName ? newEventName : name;
  const destinationName = newDestination ? newDestination : dest;
  const pictures = destinationName ? findDestination(destinations, destinationName).images : [];
  const newImages = destinationName ? pictures : [];
  const destinationImages = isCreateMode ? newImages : images;

  const descriptionText = destinationName ? findDestination(destinations, destinationName).description : ``;
  const description = destinationName ? descriptionText : ``;
  const destinationDescriptionTemplate = createDestinationDescTemplate(description, destinationImages);
  const offerObject = findOffers(modelOffers, eventName);
  const offersTemplate = createOffersTemplate(offerObject);
  const eventNameUpperCase = makeFirstLetterUppercase(eventName);
  const iconName = eventName;
  const startTime = `${getDateTime(startDate, true)} ${formatTime(startDate)}`;
  const endTime = `${getDateTime(endDate, true)} ${formatTime(endDate)}`;
  const destinationsTemplate = createDestinationsTemplate(destinations);
  const resetButtonText = isCreateMode ? `Cancel` : `Delete`;
  const addToFavoritesButton = isCreateMode ? `` : createAddToFavoritesButtonTemplate(isFavorite);
  const rollUpButton = isCreateMode ? `` : createRollUpButtonTemplate();
  const eventTypeString = events[eventName];
  const preposition = createPreposition(eventTypeString);
  const transportTypeNames = Object.keys(events).filter((key) => events[key] === `move`);
  const activityTypeNames = Object.keys(events).filter((key) => events[key] === `stop`);
  const eventDetailsTemplate = createEventDetails(offersTemplate, destinationDescriptionTemplate);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${iconName}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            ${createEventTypeItems(transportTypeNames, newEventName || eventName)}

          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>
            ${createEventTypeItems(activityTypeNames, newEventName || eventName)}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${eventNameUpperCase} ${preposition}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${destinationsTemplate}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
        —
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          €
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${resetButtonText}</button>

      ${addToFavoritesButton}
      ${rollUpButton}
    </header>
      ${eventDetailsTemplate}
  </form>`
  );
};

export default class EventForm extends AbstractSmartComponent {
  constructor(eventItem, eventsModel, mode) {
    super();
    this._eventItem = eventItem;
    this._eventsModel = eventsModel;
    this._mode = mode;
    this._newEventName = null;
    this._newEventDestination = null;
    this._element = null;
    this._submitHandler = null;
    this._addToFavoritesHandler = null;
    this._resetButtonHandler = null;
    this._rollUpButtonHandler = null;
    this._destinationInputHandler = null;
    this._flatpickr = null;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setAddToFavoritesHandler(this._addToFavoritesHandler);
    this.setRollUpButtonHandler(this._rollUpButtonHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this.recoveryListeners();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createEventFormTemplate(this._eventItem, this._eventsModel, this._mode, {newEventName: this._newEventName, newDestination: this._newEventDestination});
  }

  getData() {
    const form = this.getElement();

    return new FormData(form);
  }

  setSubmitHandler(handler) {
    this
      .getElement()
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setAddToFavoritesHandler(handler) {
    if (this._mode === EventControllerMode.CREATE) {
      return;
    }

    this
      .getElement()
      .querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);

    this._addToFavoritesHandler = handler;
  }

  setResetButtonHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._resetButtonHandler = handler;
  }

  setRollUpButtonHandler(handler) {
    if (this._mode === EventControllerMode.CREATE) {
      return;
    }

    this
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._rollUpButtonHandler = handler;
  }

  _subscribeOnEvents() {
    this
      .getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, (evt) => {
        this._newEventName = evt.target.value;
        this.rerender();
      });

    this
      .getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const userInput = evt.target.value;

        const destinations = this._eventsModel.getDestinations();
        const destination = findDestination(destinations, userInput);

        if (destination) {
          this._newEventDestination = userInput;
          this.rerender();
        }
      });
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.startDate.destroy();
      this._flatpickr.endDate.destroy();
      this._flatpickr = null;
    }

    const config = {
      altInput: true,
      allowInput: true,
      altFormat: `d/m/Y H:i`,
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true
    };

    const startTimeElement = this.getElement().querySelector(`#event-start-time-1`);
    const endTimeElement = this.getElement().querySelector(`#event-end-time-1`);

    this._flatpickr = {};
    this._flatpickr.startDate = flatpickr(startTimeElement, Object.assign(config, {defaultDate: this._eventItem.startDate}));
    this._flatpickr.endDate = flatpickr(endTimeElement, Object.assign(config, {defaultDate: this._eventItem.endDate}));
  }
}
