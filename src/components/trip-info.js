import AbstractSmartComponent from './abstract-smart-component.js';
import moment from 'moment';

const createTitle = (events) => {
  if (events.length === 0) {
    return ``;
  }

  const titles = events.map((event) => event.destination);

  if (events.length === 1) {
    return titles.join(``);
  }

  const [first] = titles;
  const last = titles[titles.length - 1];

  if (events.length <= 3) {
    return titles.join(` &mdash; `);
  }

  return `${first} &mdash; … &mdash; ${last}`;
};

const createTotalCost = (events) => {
  if (events.length === 0) {
    return 0;
  }

  return events.reduce((eventTotal, event) => {
    const eventPrice = event.price;

    if (event.offers.length === 0) {
      eventTotal += eventPrice;
      return eventTotal;
    }

    const eventOffersPrice = event.offers.reduce((offersTotal, offer) => {
      offersTotal += offer.price;
      return offersTotal;
    }, 0);

    eventTotal += eventPrice + eventOffersPrice;
    return eventTotal;
  }, 0);
};

const createDates = (events) => {
  if (events.length === 0) {
    return ``;
  }

  const [firstEvent] = events;
  const lastEvent = events[events.length - 1];

  const startDate = moment(firstEvent.startDate);
  const endDate = moment(lastEvent.endDate);

  const isSameDay = startDate.isSame(endDate.toDate(), `day`);
  const isSameMonth = startDate.isSame(endDate.toDate(), `month`);

  if (isSameDay) {
    return startDate.format(`MMM D`);
  }

  if (isSameMonth) {
    return `${startDate.format(`MMM D`)}&nbsp;—&nbsp;${endDate.format(`D`)}`;
  }

  return `${startDate.format(`MMM D`)}&nbsp;—&nbsp;${endDate.format(`MMM D`)}`;
};

export const createTripInfoTemplate = (events) => {
  const title = createTitle(events);
  const totalCost = createTotalCost(events);
  const dates = createDates(events);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();

    this._eventsModel = eventsModel;
    this._rerender = this._rerender.bind(this);

    this._eventsModel.setDataChangeHandler(this._rerender);
  }

  getTemplate() {
    const events = this._eventsModel.getEvents();

    return createTripInfoTemplate(events);
  }

  _rerender() {
    super.rerender();
  }
}
