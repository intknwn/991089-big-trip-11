import TripDaysItemComponent from '../components/trip-days-item.js';
import EventItemComponent from '../components/event-item.js';
import EventFormComponent from '../components/event-form.js';
import {render, RenderPosition, replace} from '../utils/render.js';

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  renderEventItem(tripEventsList, event) {
    const onEditButtonClick = () => {
      replace(eventFormComponent, eventItemComponent);
    };

    const onEditFormSubmit = (evt) => {
      evt.preventDefault();
      replace(eventItemComponent, eventFormComponent);
    };

    const eventItemComponent = new EventItemComponent(event);
    eventItemComponent.setClickHandler(onEditButtonClick);

    const eventFormComponent = new EventFormComponent(event, false);
    eventFormComponent.setSubmitHandler(onEditFormSubmit);

    render(tripEventsList, eventItemComponent, RenderPosition.BEFOREEND);
  }

  render(events) {
    const sortedByDateKeys = Object.keys(events).sort();

    const tripDaysItemComponents = sortedByDateKeys.map((date, index) => {
      const counter = index + 1;
      const tripDaysItemComponent = new TripDaysItemComponent(counter, date);
      const tripEventsListElement = tripDaysItemComponent.getEventsListElement();

      events[date].forEach((event) => {
        this.renderEventItem(tripEventsListElement, event);
      });

      return tripDaysItemComponent;
    });

    tripDaysItemComponents.forEach((item) => render(this._container.getElement(), item, RenderPosition.BEFOREEND));
  }
}
