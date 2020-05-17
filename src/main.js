import TripInfoComponent from './components/trip-info.js';
import MenuComponent, {MenuItem} from './components/menu.js';
import TripDaysListComponent from './components/trip-days.js';
import MessageComponent from './components/message.js';
import StatsComponent from './components/stats.js';
import TripController from './controllers/trip';
import EventsModel from './models/events.js';
import {render, remove, RenderPosition} from './utils/render.js';
import API from './api';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = `Basic DJHskh2afJ9HSFSUAoy4`;
const URL = `https://11.ecmascript.pages.academy/big-trip`;

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(AUTHORIZATION, URL);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const NO_EVENTS = [];
const eventsModel = new EventsModel();

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent(eventsModel), RenderPosition.AFTERBEGIN);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuComponent = new MenuComponent();
render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

const tripEventsElement = document.querySelector(`.trip-events`);

const messageElement = new MessageComponent();
render(tripEventsElement, messageElement, RenderPosition.AFTERBEGIN);
messageElement.createLoadingMessage();

const tripDaysListComponent = new TripDaysListComponent();
render(tripEventsElement, tripDaysListComponent, RenderPosition.AFTERBEGIN);

const tripController = new TripController(tripDaysListComponent, eventsModel, apiWithProvider);
tripController.setMenuComponent(menuComponent);

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
      tripController.closeNewEventForm();
      tripController.hide();
      statsComponent.renderCharts();
      statsComponent.show();
      elements.forEach((element) => element.classList.add(`page-body__container--stats`));
      break;
  }
});

apiWithProvider.getDestinations()
  .then((destinations) => {
    eventsModel.setDestinations(destinations);
  })
  .catch((err) => {
    messageElement.createDestinationsErrorMessage();
    throw err;
  })
  .then(() => apiWithProvider.getOffers())
  .then((offers) => {
    eventsModel.setOffers(offers);
  })
  .catch((err) => {
    messageElement.createOffersErrorMessage();
    throw err;
  })
  .then(() => {
    return apiWithProvider.getEvents();
  })
  .catch(() => {
    return NO_EVENTS;
  })
  .then((events) => {
    remove(messageElement);
    eventsModel.setEvents(events);
    tripController.render();
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (!apiWithProvider.isSynced()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});
