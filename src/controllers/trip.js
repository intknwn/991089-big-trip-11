import TripDaysItemComponent from '../components/trip-days-item.js';
import EventController, {Mode as EventControllerMode, EmptyEvent} from './event.js';
import SortController from './sort.js';
import FiltersController from './filter';
import NoEventsComponent from '../components/no-events.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {createSortedByDateObject} from '../utils/common.js';
import {SortName} from '../const.js';

const renderEvents = (eventsListElement, events, onDataChange, onViewChange) => {
  return events.map((event) => {
    const eventController = new EventController(eventsListElement, onDataChange, onViewChange);
    eventController.render(event, EventControllerMode.DEFAULT);

    return eventController;
  });
};

export default class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._shownEventControllers = [];
    this._shownTripDaysItemComponents = [];
    this._noEventsComponent = null;
    this._newEvent = null;
    this._activeSort = SortName.EVENT;

    this._sortController = null;
    this._filtersController = null;

    this._addEventButton = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
    this._eventsModel.setSortChangeHandler(this._onSortChange);

    this._createSortController();
    this._createFiltersController();

    this._setAddEventButtonHandler();
  }

  render() {
    const events = this._eventsModel.getEvents();
    this._renderEvents(events);
  }

  _onDataChange(eventController, oldData, newData) {
    if (newData === null) {
      this._newEvent = null;
      this._addEventButton.disabled = false;
      this._eventsModel.removeEvent(oldData.id);
      eventController.destroy();
      this._updateEvents();
    } else if (newData) {
      if (this._newEvent) {
        this._newEvent = null;
        this._addEventButton.disabled = false;
        eventController.destroy();
        this._eventsModel.addEvent(newData);
        this._updateEvents();
      } else {
        const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

        if (isSuccess) {
          eventController.render(newData, EventControllerMode.DEFAULT);
        }
      }
    }
  }

  _onViewChange() {
    if (this._newEvent) {
      this._newEvent.destroy();
      this._newEvent = null;
      this._addEventButton.disabled = false;
    }
    this._shownEventControllers.forEach((controller) => controller.setDefaultView());
  }

  _renderEvents(events) {
    const containerElement = this._container.getElement();
    if (events.length === 0) {
      this._noEventsComponent = new NoEventsComponent();
      render(containerElement, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    const eventsByDate = createSortedByDateObject(events);
    const sortedByDateKeys = Object.keys(eventsByDate).sort();

    if (this._activeSort === SortName.EVENT) {
      const tripDaysItemComponents = sortedByDateKeys.map((date) => {
        const counter = eventsByDate[date][0].day;
        const eventsOnADate = eventsByDate[date];

        const tripDaysItemComponent = this._createDayItemComponent(eventsOnADate, counter, date);

        return tripDaysItemComponent;
      });

      tripDaysItemComponents.forEach((component) => {
        this._shownTripDaysItemComponents.push(component);
        render(containerElement, component, RenderPosition.BEFOREEND);
      });
    } else {
      const tripDaysItemComponent = this._createDayItemComponent(events);
      render(containerElement, tripDaysItemComponent, RenderPosition.BEFOREEND);
      this._shownTripDaysItemComponents.push(tripDaysItemComponent);
    }

  }

  _createDayItemComponent(events, counter, date) {
    const tripDaysItemComponent = new TripDaysItemComponent(counter, date);
    const tripEventsListElement = tripDaysItemComponent.getEventsListElement();
    const newEvents = renderEvents(tripEventsListElement, events, this._onDataChange, this._onViewChange);
    this._shownEventControllers = [...newEvents, ...this._shownEventControllers];

    return tripDaysItemComponent;
  }

  createEvent() {
    if (this._newEvent) {
      return;
    }
    this._sortController.destroy();
    this._filtersController.setDefaultFilter();
    this._onViewChange();

    const tripEventsElement = document.querySelector(`.trip-events`);

    this._newEvent = new EventController(tripEventsElement, this._onDataChange, this._onViewChange);
    this._newEvent.render(EmptyEvent, EventControllerMode.CREATE);
    this._sortController.render();
  }

  _removeEvents() {
    this._shownEventControllers.forEach((eventController) => eventController.destroy());
    this._shownEventControllers = [];
  }

  _removeTripDaysComponents() {
    this._shownTripDaysItemComponents.forEach((component) => remove(component));
    this._shownTripDaysItemComponents = [];
  }

  _removeNoEventsComponent() {
    if (this._noEventsComponent) {
      remove(this._noEventsComponent);
    }
  }

  _updateEvents() {
    this._removeEvents();
    this._removeTripDaysComponents();
    this._removeNoEventsComponent();
    this._renderEvents(this._eventsModel.getEvents());
  }

  _onFilterChange() {
    this._updateEvents();
  }

  _onSortChange(sortName) {
    this._activeSort = sortName;
    this._updateEvents();
  }

  _createSortController() {
    const tripEventsElement = document.querySelector(`.trip-events`);
    this._sortController = new SortController(tripEventsElement, this._eventsModel);
    this._sortController.render();
  }

  _createFiltersController() {
    const tripControlsElement = document.querySelector(`.trip-controls`);
    this._filtersController = new FiltersController(tripControlsElement, this._eventsModel);
    this._filtersController.render();
  }

  _setAddEventButtonHandler() {
    this._addEventButton = document.querySelector(`.trip-main__event-add-btn`);
    this._addEventButton.addEventListener(`click`, (evt) => {
      evt.target.disabled = true;
      this.createEvent();
    });
  }
}
