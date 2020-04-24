import TripDaysItemComponent from '../components/trip-days-item.js';
import EventController from './event.js';
import NoEventsComponent from '../components/no-events.js';
import {render, RenderPosition} from '../utils/render.js';

const renderEvents = (eventsListElement, events, onDataChange, onViewChange) => {
  return events.map((event) => {
    const eventController = new EventController(eventsListElement, onDataChange, onViewChange);
    eventController.render(event);

    return eventController;
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._shownEventControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(events) {
    this._events = events;
    const containerElement = this._container.getElement();
    if (events.length === 0) {
      render(containerElement, new NoEventsComponent(), RenderPosition.BEFOREEND);
      return;
    }

    const sortedByDateKeys = Object.keys(events).sort();

    const tripDaysItemComponents = sortedByDateKeys.map((date, index) => {
      const counter = index + 1;
      const tripDaysItemComponent = new TripDaysItemComponent(counter, date);
      const tripEventsListElement = tripDaysItemComponent.getEventsListElement();

      const eventsOnADate = events[date];

      const newEvents = renderEvents(tripEventsListElement, eventsOnADate, this._onDataChange, this._onViewChange);
      this._shownEventControllers = [...newEvents, ...this._shownEventControllers];

      return tripDaysItemComponent;
    });

    tripDaysItemComponents.forEach((item) => render(containerElement, item, RenderPosition.BEFOREEND));
  }

  _onDataChange(eventController, oldData, newData) {
    const {eventIndex: index, eventDate: date} = Object.keys(this._events).reduce((acc, eventDate) => {
      const eventIndex = this._events[eventDate].findIndex((event) => event === oldData);

      return eventIndex === -1 ? acc : Object.assign(acc, {eventDate, eventIndex});
    }, {});

    if (index === -1) {
      return;
    }

    this._events[date] = [...this._events[date].slice(0, index), newData, ...this._events[date].slice(index + 1)];
    eventController.render(this._events[date][index]);
  }

  _onViewChange() {
    this._shownEventControllers.forEach((controller) => controller.setDefaultView());
  }
}
