import TripInfoComponent from './components/trip-info.js';
import TripCostComponent from './components/trip-info-cost.js';
import MenuComponent from './components/menu.js';
import TripDaysListComponent from './components/trip-days.js';
import TripController from './controllers/trip';
import FiltersController from './controllers/filter.js';
import EventsModel from './models/events.js';
import {createEventItems} from './mocks/event-item.js';
import {render, RenderPosition} from './utils/render.js';

const EVENTS_COUNT = 5;
const events = createEventItems(EVENTS_COUNT);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripCostComponent(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
render(tripControlsElement, new MenuComponent(), RenderPosition.AFTERBEGIN);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripEventsElement = document.querySelector(`.trip-events`);

const tripDaysListComponent = new TripDaysListComponent();
render(tripEventsElement, tripDaysListComponent, RenderPosition.AFTERBEGIN);

const tripController = new TripController(tripDaysListComponent, eventsModel);
tripController.render();


