export default class Store {
  constructor(key, storage) {
    this._key = key;
    this._storage = storage;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._key)) || {};
    } catch (err) {
      return {};
    }
  }

  setEvent(key, value) {
    const store = this.getItems();
    const storeEvents = store.events || {};
    const updatedStoreEvents = Object.assign({}, storeEvents, {[key]: value});

    this._storage.setItem(
        this._key,
        JSON.stringify(
            Object.assign({}, store, {
              events: updatedStoreEvents
            })
        )
    );
  }

  setEvents(events) {
    const store = this.getItems();
    const storeEvents = store.events || [];
    const updatedStoreEvents = Object.assign({}, storeEvents, events);

    this._storage.setItem(
        this._key,
        JSON.stringify(
            Object.assign({}, store, {
              events: updatedStoreEvents
            })
        )
    );
  }


  removeEvent(key) {
    const store = this.getItems();

    delete store.events[key];

    this._storage.setItem(
        this._key,
        JSON.stringify(store)
    );
  }

  setDestinations(destinations) {
    const store = this.getItems();

    this._storage.setItem(
        this._key,
        JSON.stringify(
            Object.assign({}, store, {
              destinations: [...destinations]
            })
        )
    );
  }

  setOffers(offers) {
    const store = this.getItems();

    this._storage.setItem(
        this._key,
        JSON.stringify(
            Object.assign({}, store, {
              offers: [...offers]
            })
        )
    );
  }
}
