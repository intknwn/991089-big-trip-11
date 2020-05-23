import Event from '../models/event.js';
import Destination from '../models/destination.js';
import Offer from '../models/offer.js';

const Url = {
  EVENTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
  SYNC: `points/sync`
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization, baseUrl) {
    this._authorization = authorization;
    this._baseUrl = baseUrl;
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._baseUrl}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  sync(data) {
    return this._load({
      url: Url.SYNC,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  updateEvent(id, data) {
    return this._load({
      url: `${Url.EVENTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parse);
  }

  createEvent(data) {
    return this._load({
      url: Url.EVENTS,
      method: Method.POST,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parse);
  }

  deleteEvent(id) {
    return this._load({url: `${Url.EVENTS}/${id}`, method: Method.DELETE});
  }

  getEvents() {
    return this._load({url: Url.EVENTS})
      .then((response) => response.json())
      .then(Event.parseAll);
  }

  getDestinations() {
    return this._load({url: Url.DESTINATIONS})
      .then((response) => response.json())
      .then(Destination.parseAll);
  }

  getOffers() {
    return this._load({url: Url.OFFERS})
      .then((response) => response.json())
      .then(Offer.parseAll);
  }
}

