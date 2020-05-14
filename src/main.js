import TripInfoComponent from './components/trip-info.js';
import TripCostComponent from './components/trip-info-cost.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import TripDaysListComponent from './components/trip-days.js';
import LoadingComponent from './components/loading.js';
import StatsComponent from './components/stats.js';
import TripController from './controllers/trip';
import EventsModel from './models/events.js';
import {render, remove, RenderPosition} from './utils/render.js';
import API from './api';

const AUTHORIZATION = `Basic DJHskh2afJ9HSFSUAoy4`;
const URL = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(AUTHORIZATION, URL);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripCostComponent(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuComponent = new MenuComponent();
render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

const eventsModel = new EventsModel();

const tripEventsElement = document.querySelector(`.trip-events`);

const loadingMessageElement = new LoadingComponent();

render(tripEventsElement, loadingMessageElement, RenderPosition.AFTERBEGIN);

const tripDaysListComponent = new TripDaysListComponent();
render(tripEventsElement, tripDaysListComponent, RenderPosition.AFTERBEGIN);

const tripController = new TripController(tripDaysListComponent, eventsModel, api);

const statsComponent = new StatsComponent(eventsModel);
render(tripEventsElement, statsComponent, RenderPosition.AFTERBEGIN);
statsComponent.hide();

menuComponent.setOnChange((menuItem) => {
  const elements = document.querySelectorAll(`.page-body__container`);

  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      statsComponent.hide();
      tripController.show();
      elements.forEach((element) => element.classList.remove(`page-body__container--stats`));
      break;
    case MenuItem.STATS:
      menuComponent.setActiveItem(MenuItem.STATS);
      tripController.hide();
      statsComponent.show();
      elements.forEach((element) => element.classList.add(`page-body__container--stats`));
      break;
  }
});

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
    statsComponent.renderCharts();
  });
