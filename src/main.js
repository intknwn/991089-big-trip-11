import TripInfoComponent from './components/trip-info.js';
import TripCostComponent from './components/trip-info-cost.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';
import SortingComponent from './components/sorting.js';
import TripDaysListComponent from './components/trip-days.js';
import TripController from './controllers/trip';
import {createEventItems} from './mocks/event-item.js';
import {createSortedByDateObject} from './utils/common.js';
import {render, RenderPosition} from './utils/render.js';

const EVENTS_COUNT = 20;
const unsortedEvents = createEventItems(EVENTS_COUNT);
const sortedEvents = createSortedByDateObject(unsortedEvents);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripCostComponent(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
render(tripControlsElement, new MenuComponent(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new FiltersComponent(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, new SortingComponent(), RenderPosition.BEFOREEND);

const tripDaysListComponent = new TripDaysListComponent();
render(tripEventsElement, tripDaysListComponent, RenderPosition.BEFOREEND);
const tripController = new TripController(tripDaysListComponent);
tripController.render(sortedEvents);
