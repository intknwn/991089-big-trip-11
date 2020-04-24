import {formatTime, castTimeFormat, getDateTime, createPreposition, makeFirstLetterUppercase} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const getDuration = (startDate, endDate) => {
  const diff = endDate.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor((diff / (1000 * 60 * 60)));
  const diffInMinutes = diff / (1000 * 60);

  const days = diffInDays < 1 ? `` : `${castTimeFormat(diffInDays)}D `;
  const hours = diffInHours < 1 ? `` : `${castTimeFormat(diffInHours % 24)}H `;
  const minutes = diffInMinutes < 1 ? `` : `${castTimeFormat(diffInMinutes % 60)}M`;

  return `${days}${hours}${minutes}`;
};

const createOffersTemplate = (offers) =>
  offers.map((offer) => {
    return (
      `<li class="event__offer">
      <span class="event__offer-title">${offer.desc}</span>
      +
      €&nbsp;<span class="event__offer-price">${offer.price}</span>
     </li>`
    );
  }).join(`\n`);

export const createEventItemTemplate = (eventItem) => {
  const {eventName, eventType, destination, offers, startDate, endDate, price} = eventItem;
  const eventNameUpperCase = makeFirstLetterUppercase(eventName);
  const iconName = eventName;
  const duration = getDuration(startDate, endDate);
  const startDateTime = getDateTime(startDate);
  const endDateTime = getDateTime(endDate);
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);
  const offersTemplate = createOffersTemplate(offers);
  const preposition = createPreposition(eventType);


  return (
    `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${iconName}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventNameUpperCase} ${preposition} ${destination}</h3>

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
  constructor(eventItem) {
    super();
    this._eventItem = eventItem;
  }

  getTemplate() {
    return createEventItemTemplate(this._eventItem);
  }

  setClickHandler(handler) {
    this
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
