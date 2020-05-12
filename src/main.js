import TripInfoComponent from './components/trip-info.js';
import TripCostComponent from './components/trip-info-cost.js';
import MenuComponent from './components/menu.js';
import TripDaysListComponent from './components/trip-days.js';
import LoadingComponent from './components/loading.js';
import TripController from './controllers/trip';
import EventsModel from './models/events.js';
import {render, remove, RenderPosition} from './utils/render.js';
import API from './api';

const AUTHORIZATION = `Basic DJHskh2afJ9HSFSUAoy4`;

const api = new API(AUTHORIZATION);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripCostComponent(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
render(tripControlsElement, new MenuComponent(), RenderPosition.AFTERBEGIN);

const eventsModel = new EventsModel();

const tripEventsElement = document.querySelector(`.trip-events`);

const loadingMessageElement = new LoadingComponent();

render(tripEventsElement, loadingMessageElement, RenderPosition.AFTERBEGIN);

const tripDaysListComponent = new TripDaysListComponent();
render(tripEventsElement, tripDaysListComponent, RenderPosition.AFTERBEGIN);

const tripController = new TripController(tripDaysListComponent, eventsModel, api);

api.getDestinations()
  .then((destinations) => {
    eventsModel.setDestinations(destinations);
  })
  .then(() => api.getOffers())
  .then((offers) => {
    eventsModel.setOffers(offers);
  })
  .then(() => api.getEvents())
  .then((events) => {
    remove(loadingMessageElement);
    eventsModel.setEvents(events);
    tripController.render();
  });
