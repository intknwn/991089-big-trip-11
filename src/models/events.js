import {getFilteredEvents} from '../utils/filter.js';
import {FilterName, SortName} from '../const.js';
import {sortEvents} from '../utils/sort.js';
import {addDayProperty} from '../utils/common.js';

export default class EventsModel {
  constructor() {
    this._events = [];
    this._destinations = [];
    this._offers = [];
    this._activeFilter = FilterName.EVERYTHING;
    this._activeSort = SortName.EVENT;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._sortChangeHandlers = [];
  }

  getEvents() {
    if (this._events.length === 0) {
      return [];
    }

    const events = addDayProperty(this._events);
    const filteredEvents = getFilteredEvents(events, this._activeFilter);
    const sortedEvents = sortEvents(filteredEvents, this._activeSort);

    return sortedEvents;
  }

  getEventsAll() {
    return this._events;
  }

  setEvents(events) {
    this._events = events;
    this._callHandlers(this._dataChangeHandlers);
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }

  setFilter(filterName) {
    this._activeFilter = filterName;
    this._callHandlers(this._filterChangeHandlers);
  }

  setSort(sortName) {
    this._activeSort = sortName;
    this._callHandlers(this._sortChangeHandlers);
  }

  updateEvent(id, newEvent) {
    const index = this._events.findIndex((event) => event.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [...this._events.slice(0, index), newEvent, ...this._events.slice(index + 1)];

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeEvent(id) {
    const index = this._events.findIndex((event) => event.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addEvent(event) {
    this._events = [event, ...this._events];
    this._callHandlers(this._dataChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setSortChangeHandler(handler) {
    this._sortChangeHandlers.push(() => handler(this._activeSort));
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
