import {formatTime, getDateTime, createPreposition, makeFirstLetterUppercase} from '../utils/common.js';
import {destinations, createDescriptionText, lorem, events, Offers} from '../mocks/event-item.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const createDestinationsTemplate = (destItems) => {
  return destItems.map((dest) => `<option value="${dest}"></option>`).join(`\n`);
};

const createOfferSelectorsTemplate = (offers) => {
  return offers.map((offer) => {
    return (
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}" type="checkbox" name="event-offer-${offer.name}" checked="">
          <label class="event__offer-label" for="event-offer-${offer. name}">
            <span class="event__offer-title">${offer.desc}</span>
            +
            €&nbsp;<span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
    );
  }).join(`\n`);
};

const createOffersTemplate = (offers) => {
  const offerSelectorsTemplate = createOfferSelectorsTemplate(offers);
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

      ${offerSelectorsTemplate}

      </div>
      </section>`
  );
};

const createImagesTemplate = (images) =>
  images.map((url) => `<img class="event__photo" src="${url}" alt="Event photo">`).join(`\n`);


const createDestinationDescTemplate = (description, images) => {
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

export const createEventFormTemplate = (eventItem, isNewEvent = true, changes) => {
  const {eventName, eventType, destination, offers, description, images, startDate, endDate, price, isFavorite} = eventItem;
  const {newEventName} = changes;
  const newOffers = Offers[newEventName];
  const eventNameUpperCase = newEventName ? makeFirstLetterUppercase(newEventName) : makeFirstLetterUppercase(eventName);
  const iconName = newEventName || eventName;
  const startTime = `${getDateTime(startDate, true)} ${formatTime(startDate)}`;
  const endTime = `${getDateTime(endDate, true)} ${formatTime(endDate)}`;
  const destinationsTemplate = createDestinationsTemplate(destinations);
  const resetButtonText = isNewEvent ? `Cancel` : `Delete`;
  const addToFavoritesButton = isNewEvent ? `` : createAddToFavoritesButtonTemplate(isFavorite);
  const rollUpButton = isNewEvent ? `` : createRollUpButtonTemplate();
  const offersTemplate = offers.length === 0 ? `` : createOffersTemplate(newOffers || offers);
  const descriptionText = newEventName ? createDescriptionText(lorem) : description;
  const destinationDescriptionTemplate = createDestinationDescTemplate(descriptionText, images);
  const eventTypeString = newEventName ? events[newEventName] : eventType;
  const preposition = createPreposition(eventTypeString);
  const transportTypeNames = Object.keys(events).filter((key) => events[key] === `move`);
  const activityTypeNames = Object.keys(events).filter((key) => events[key] === `stop`);

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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${resetButtonText}</button>

      ${addToFavoritesButton}
      ${rollUpButton}
    </header>
    <section class="event__details">

      ${offersTemplate}

      ${destinationDescriptionTemplate}
    </section>
  </form>`
  );
};

export default class EventForm extends AbstractSmartComponent {
  constructor(eventItem, isNewEvent = true) {
    super();
    this._eventItem = eventItem;
    this._isNewEvent = isNewEvent;
    this._newEventName = null;
    this._element = null;
    this._submitHandler = null;
    this._addToFavoritesHandler = null;

    this._subscribeOnEvents();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setAddToFavoritesHandler(this._addToFavoritesHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this.recoveryListeners();
  }

  getTemplate() {
    return createEventFormTemplate(this._eventItem, this._isNewEvent, {newEventName: this._newEventName});
  }

  setSubmitHandler(handler) {
    this
      .getElement()
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setAddToFavoritesHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);

    this._addToFavoritesHandler = handler;
  }

  _subscribeOnEvents() {
    const eventTypeList = this.getElement().querySelector(`.event__type-list`);

    eventTypeList.addEventListener(`change`, (evt) => {
      this._newEventName = evt.target.value;
      this.rerender();
    });
  }
}
