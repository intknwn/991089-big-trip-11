import Event from '../models/event.js';
import Destination from '../models/destination.js';
import Offer from '../models/offer.js';
import {nanoid} from 'nanoid';

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._synced = true;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map((event) => event.toRAW()));

          this._store.setEvents(items);

          return events;
        });
    }

    const {events} = this._store.getItems();

    return Promise.resolve(Event.parseAll(Object.values(events)));
  }

  createEvent(data) {
    if (isOnline()) {
      return this._api.createEvent(data)
        .then((newEvent) => {
          this._store.setEvent(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    this._synced = false;
    const newLocalEventId = nanoid();
    const newLocalEvent = Event.clone(Object.assign(data, {id: newLocalEventId}));

    this._store.setEvent(newLocalEvent.id, newLocalEvent.toRAW());

    return Promise.resolve(newLocalEvent);
  }

  updateEvent(id, data) {
    if (isOnline()) {
      return this._api.updateEvent(id, data)
        .then((newEvent) => {
          this._store.setEvent(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    this._synced = false;
    const localEvent = Event.clone(Object.assign(data, {id}));
    this._store.setEvent(id, localEvent.toRAW());

    return Promise.resolve(localEvent);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._store.removeEvent(id));
    }

    this._synced = false;
    this._store.removeEvent(id);

    return Promise.resolve();
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations.map((destination) => destination.toRAW()));

          return destinations;
        });
    }

    const {destinations} = this._store.getItems();

    return Promise.resolve(Destination.parseAll(destinations));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);

          return offers;
        });
    }

    const {offers} = this._store.getItems();

    return Promise.resolve(Offer.parseAll(offers));
  }

  isSynced() {
    return this._synced;
  }

  sync() {
    if (isOnline()) {
      const {events} = this._store.getItems();
      const values = Object.values(events);

      return this._api.sync(values)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          const syncedEvents = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setEvents(syncedEvents);

          this._synced = true;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
