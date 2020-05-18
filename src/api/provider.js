import Event from '../models/event.js';
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

          this._store.setItems(items);

          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems());

    return Promise.resolve(Event.parseEvents(storeEvents));
  }

  createEvent(data) {
    if (isOnline()) {
      return this._api.createEvent(data)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    this._synced = false;
    const newLocalEventId = nanoid();
    const newLocalEvent = Event.clone(Object.assign(data, {id: newLocalEventId}));

    this._store.setItem(newLocalEvent.id, newLocalEvent.toRAW());

    return Promise.resolve(newLocalEvent);
  }

  updateEvent(id, data) {
    if (isOnline()) {
      return this._api.updateEvent(id, data)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    this._synced = false;
    const localEvent = Event.clone(Object.assign(data, {id}));
    this._store.setItem(id, localEvent.toRAW());

    return Promise.resolve(localEvent);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._store.removeItem(id));
    }

    this._synced = false;
    this._store.removeItem(id);

    return Promise.resolve();
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOffers() {
    return this._api.getOffers();
  }

  isSynced() {
    return this._synced;
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
