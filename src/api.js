import Event from './models/event.js';
import Destination from './models/destination.js';
import Offer from './models/offer.js';

const URL = {
  EVENTS: `https://11.ecmascript.pages.academy/big-trip/points`,
  DESTINATIONS: `https://11.ecmascript.pages.academy/big-trip/destinations`,
  OFFERS: `https://11.ecmascript.pages.academy/big-trip/offers`,
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  _get(url, parser) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(url, {headers})
      .then(checkStatus)
      .then((response) => response.json())
      .then(parser);
  }

  updateEvent(id, data) {
    const body = JSON.stringify(data.toRAW());

    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/${id}`, {
      method: `PUT`,
      body,
      headers,
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then(Event.parseEvent);
  }

  getEvents() {
    return this._get(URL.EVENTS, Event.parseEvents);
  }

  getDestinations() {
    return this._get(URL.DESTINATIONS, Destination.parseDestinations);
  }

  getOffers() {
    return this._get(URL.OFFERS, Offer.parseOffers);
  }
}
