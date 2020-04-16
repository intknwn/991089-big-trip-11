import TripInfoComponent from './components/trip-info.js';
import TripCostComponent from './components/trip-info-cost.js';
import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';
import EventFormComponent from './components/event-form.js';
import SortingComponent from './components/sorting.js';
import TripDaysListComponent from './components/trip-days.js';
import TripDaysItemComponent from './components/trip-days-item.js';
import EventItemComponent from './components/event-item.js';
import {createEventItems} from './mocks/event-item.js';
import {render, RenderPosition, createSortedByDateObject} from './util.js';

const EVENTS_COUNT = 20;
const unsortedEvents = createEventItems(EVENTS_COUNT);
const sortedEvents = createSortedByDateObject(unsortedEvents);


const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripCostComponent().getElement(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
render(tripControlsElement, new MenuComponent().getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new FiltersComponent().getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, new SortingComponent().getElement(), RenderPosition.BEFOREEND);

const renderEventItem = (tripEventsList, event) => {
  const onEditButtonClick = () => {
    tripEventsList.replaceChild(eventFormComponent.getElement(), eventItemComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    tripEventsList.replaceChild(eventItemComponent.getElement(), eventFormComponent.getElement());
  };

  const eventItemComponent = new EventItemComponent(event);
  const editButton = eventItemComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const eventFormComponent = new EventFormComponent(event, true);
  const editForm = eventFormComponent.getElement();
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(tripEventsList, eventItemComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderTrip = (tripDaysList, events) => {

  const sortedByDateKeys = Object.keys(events).sort();

  const tripDaysItemElements = sortedByDateKeys.map((date, index) => {
    const counter = index + 1;
    const tripDaysItemElement = new TripDaysItemComponent(counter, date).getElement();
    const tripEventsListElement = tripDaysItemElement.querySelector(`.trip-events__list`);

    events[date].forEach((event) => {
      renderEventItem(tripEventsListElement, event);
    });

    return tripDaysItemElement;
  });

  tripDaysItemElements.forEach((item) => render(tripDaysList, item, RenderPosition.BEFOREEND));
};

const tripDaysListElement = new TripDaysListComponent().getElement();
render(tripEventsElement, tripDaysListElement, RenderPosition.BEFOREEND);
renderTrip(tripDaysListElement, sortedEvents);

