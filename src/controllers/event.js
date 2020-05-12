import EventItemComponent from '../components/event-item.js';
import EventFormComponent from '../components/event-form.js';
import EventModel from '../models/event.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {findDestination, findOffers} from '../utils/common.js';

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  CREATE: `create`,
  UPDATE: `update`
};

export const EmptyEvent = {
  id: null,
  eventName: `ship`,
  eventType: ``,
  offers: [],
  destination: ``,
  description: ``,
  images: [],
  startDate: new Date(),
  endDate: new Date(),
  price: ``,
  isFavorite: false
};

const parseFormData = (data, eventsModel) => {
  const destinations = eventsModel.getDestinations();
  const modelOffers = eventsModel.getOffers();

  const eventName = data.get(`event-type`);
  const {offers} = findOffers(modelOffers, eventName);
  const destination = data.get(`event-destination`);
  const {description: descriptionText} = findDestination(destinations, destination);
  const description = destination ? descriptionText : ``;
  const {images: newImages} = findDestination(destinations, destination);
  const images = destination ? newImages : [];
  const startDate = data.get(`event-start-time`);
  const endDate = data.get(`event-end-time`);
  const price = parseInt(data.get(`event-price`), 10);

  return new EventModel({
    'base_price': price,
    'date_from': startDate,
    'date_to': endDate,
    'destination': {
      description,
      name: destination,
      pictures: images
    },
    'id': null,
    'is_favorite': false,
    'offers': offers,
    'type': eventName
  });
};

export default class EventController {
  constructor(container, eventsModel, onDataChange, onViewChange) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._eventItemComponent = null;
    this._eventFormComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
  }

  render(event, mode) {
    this._mode = mode;
    const oldEventItemComponent = this._eventItemComponent;
    const oldEventFormComponent = this._eventFormComponent;

    this._eventItemComponent = new EventItemComponent(event);
    this._eventFormComponent = new EventFormComponent(event, this._eventsModel, this._mode);

    this._eventItemComponent.setClickHandler(() => {
      this._replaceEventToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._eventFormComponent.getData();
      const data = parseFormData(formData, this._eventsModel);
      data.isFavorite = event.isFavorite;
      data.id = event.id;

      const destinationInput = evt.target.querySelector(`.event__input--destination`);
      const destinations = this._eventsModel.getDestinations();
      const destination = findDestination(destinations, destinationInput.value);

      if (destination) {
        destinationInput.setCustomValidity(``);
      } else {
        destinationInput.setCustomValidity(`Please, select one of the destinations from the list`);
      }

      if (evt.target.checkValidity()) {
        this._mode = Mode.DEFAULT;
        this._onDataChange(this, event, data);
      }

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventFormComponent.setAddToFavoritesHandler(() => {
      this._mode = Mode.UPDATE;

      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !event.isFavorite;
      this._onDataChange(this, event, newEvent);
    });

    this._eventFormComponent.setResetButtonHandler(() => {
      this._onDataChange(this, event, null);
    });

    this._eventFormComponent.setRollUpButtonHandler(() => {
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventFormComponent && oldEventItemComponent) {
          replace(this._eventItemComponent, oldEventItemComponent);
          replace(this._eventFormComponent, oldEventFormComponent);
          this._replaceFormToEvent();
        } else {
          render(this._container, this._eventItemComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.CREATE:
        if (oldEventFormComponent && oldEventItemComponent) {
          remove(oldEventItemComponent);
          remove(oldEventFormComponent);
        }
        render(this._container, this._eventFormComponent, RenderPosition.AFTERBEGIN);
        break;
      case Mode.UPDATE:
        replace(this._eventFormComponent, oldEventFormComponent);
        break;
    }
  }

  _replaceEventToForm() {
    this._onViewChange();
    replace(this._eventFormComponent, this._eventItemComponent);
    this._mode = Mode.EDIT;
  }

  _replaceFormToEvent() {
    replace(this._eventItemComponent, this._eventFormComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  getMode() {
    return this._mode;
  }

  destroy() {
    remove(this._eventItemComponent);
    remove(this._eventFormComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}

