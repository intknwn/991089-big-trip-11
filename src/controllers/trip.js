import TripDaysItemComponent from '../components/trip-days-item.js';
import EventController, {Mode as EventControllerMode, EmptyEvent, Mode} from './event.js';
import SortController from './sort.js';
import FiltersController from './filter';
import MessageComponent from '../components/message.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {createSortedByDateObject} from '../utils/common.js';
import {SortName} from '../const.js';

export default class TripController {
  constructor(container, eventsModel, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._api = api;
    this._shownEventControllers = [];
    this._shownTripDaysItemComponents = [];
    this._messageComponent = null;
    this._menuComponent = null;
    this._newEvent = null;
    this._activeSort = SortName.EVENT;

    this._sortController = null;
    this._filtersController = null;

    this._addEventButton = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);

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

  _onDataChange(eventController, oldData, newData) {
    if (newData === EmptyEvent) {
      this.closeNewEventForm();
      this._updateEvents();
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
        .then(() => {
          eventController.onSuccess();
          this._eventsModel.removeEvent(oldData.id);
          eventController.destroy();
          this._updateEvents();
        })
        .catch(() => {
          eventController.onError();
        });
    } else if (newData) {
      if (this._newEvent) {
        this._api.createEvent(newData)
          .then((event) => {
            eventController.onSuccess();
            this._newEvent = null;
            this._addEventButton.disabled = false;
            eventController.destroy();
            this._eventsModel.addEvent(event);
            this._updateEvents();
          })
          .catch(() => {
            eventController.setMode(EventControllerMode.CREATE);
            eventController.onError();
          });
      } else {
        this._api.updateEvent(oldData.id, newData)
          .then((event) => {
            eventController.onSuccess();
            const controllerMode = eventController.getMode();
            const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

            if (isSuccess) {
              if (controllerMode === Mode.UPDATE) {
                eventController.render(event, controllerMode);
              } else {
                this._updateEvents();
              }
            }
          })
          .catch(() => {
            eventController.onError();
          });
      }
    }
  }

  _onViewChange() {
    if (this._newEvent) {
      this.closeNewEventForm();
    }
    this._shownEventControllers.forEach((controller) => controller.setDefaultView());
  }

  render() {
    const events = this._eventsModel.getEvents();
    const containerElement = this._container.getElement();

    if (events.length === 0) {
      this._messageComponent = new MessageComponent();
      render(containerElement, this._messageComponent, RenderPosition.BEFOREEND);
      this._messageComponent.createNoEventsMessage();
      return;
    }

    this._sortController.show();

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
    const newEvents = this._renderEvents(tripEventsListElement, events, this._onDataChange, this._onViewChange);
    this._shownEventControllers = [...newEvents, ...this._shownEventControllers];

    return tripDaysItemComponent;
  }

  _renderEvents(eventsListElement, events) {
    return events.map((event) => {
      const eventController = new EventController(eventsListElement, this._eventsModel, this._onDataChange, this._onViewChange);
      eventController.render(event, EventControllerMode.DEFAULT);

      return eventController;
    });
  }

  createEvent() {
    if (this._newEvent) {
      return;
    }

    this._filtersController.setDefaultFilter();
    this._sortController.destroy();

    this._onViewChange();
    this._removeMessageComponent();

    const tripEventsElement = document.querySelector(`.trip-events`);

    this._newEvent = new EventController(tripEventsElement, this._eventsModel, this._onDataChange, this._onViewChange);
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

  _removeMessageComponent() {
    if (this._messageComponent) {
      remove(this._messageComponent);
    }
  }

  _updateEvents() {
    this._removeEvents();
    this._removeTripDaysComponents();
    this._removeMessageComponent();
    this.render();
  }

  _onFilterChange() {
    this._sortController.setDefault();
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
    this._sortController.hide();
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
      this._menuComponent.switchToTableView();
      this.createEvent();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });
  }

  closeNewEventForm() {
    if (!this._newEvent) {
      return;
    }

    this._newEvent.destroy();
    this._newEvent = null;
    this._addEventButton.disabled = false;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.closeNewEventForm();
    }
  }

  setMenuComponent(component) {
    this._menuComponent = component;
  }

  hide() {
    this._container.hide();
    this._sortController.hide();
  }

  show() {
    this._container.show();
    this._sortController.show();
  }
}
