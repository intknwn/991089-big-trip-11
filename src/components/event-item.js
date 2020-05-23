import {formatTime, getDateTime, getFormattedDuration, createPreposition, makeFirstLetterUppercase} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const MAX_OFFERS_TO_SHOW = 3;

const createOffersTemplate = (offers) => {
  const lastIndex = MAX_OFFERS_TO_SHOW;
  return offers.slice(0, lastIndex).map(({title, price}) => {
    return (
      `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      +
      €&nbsp;<span class="event__offer-price">${price}</span>
     </li>`
    );
  }).join(`\n`);
};

export const createEventItemTemplate = (eventItem) => {
  const {name, destination, offers, startDate, endDate, price} = eventItem;
  const nameUpperCase = makeFirstLetterUppercase(name);
  const iconName = name;
  const duration = getFormattedDuration(startDate, endDate);
  const startDateTime = getDateTime(startDate);
  const endDateTime = getDateTime(endDate);
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);
  const offersTemplate = createOffersTemplate(offers);
  const preposition = createPreposition(name);


  return (
    `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${iconName}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${nameUpperCase} ${preposition} ${destination}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDateTime}T${startTime}">${startTime}</time>
          —
          <time class="event__end-time" datetime="${endDateTime}T${endTime}">${endTime}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>

      <p class="event__price">
        €&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersTemplate}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class EventItem extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventItemTemplate(this._event);
  }

  setClickHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
