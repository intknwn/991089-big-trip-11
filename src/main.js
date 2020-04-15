import {createTripInfoTemplate} from './components/trip-info.js';
import {createTripInfoCostTemplate} from './components/trip-info-cost.js';
import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createEventFormTemplate} from './components/event-form.js';
import {createSortingTemplate} from './components/sorting.js';
import {createTripDaysTemplate} from './components/trip-days.js';
import {createEventItemTemplate} from './components/event-item.js';
import {createEventItems} from './mocks/event-item.js';

const EVENTS_COUNT = 20;

const events = createEventItems(EVENTS_COUNT);
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripInfoCostTemplate(), `beforeend`);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
render(tripControlsElement, createMenuTemplate(), `afterbegin`);
render(tripControlsElement, createFiltersTemplate(), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createSortingTemplate(), `beforeend`);
render(tripEventsElement, createTripDaysTemplate(events), `beforeend`);
