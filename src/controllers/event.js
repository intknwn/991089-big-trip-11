import EventItemComponent from '../components/event-item.js';
import EventFormComponent from '../components/event-form.js';
import EventModel from '../models/event.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {findDestination, findOffers, getDuration} from '../utils/common.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

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

const parseOffers = (formComponent, offers) => {
  const offerTitles = [];

  formComponent
    .getElement()
    .querySelectorAll(`.event__offer-checkbox`)
    .forEach((element) => {
      if (element.checked) {
        offerTitles.push(element.dataset.title);
      }
    });

  return offerTitles.map((title) => {
    return offers.find((offer) => offer.title === title);
  });
};

const parseFormData = (data, eventsModel, formComponent) => {
  const destinations = eventsModel.getDestinations();
  const modelOffers = eventsModel.getOffers();

  const eventName = data.get(`event-type`);
  const {offers} = findOffers(modelOffers, eventName);
  const eventOffers = parseOffers(formComponent, offers);
  const destination = data.get(`event-destination`);
  const {description} = findDestination(destinations, destination);
  const {images} = findDestination(destinations, destination);
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
    'offers': eventOffers,
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

      const form = evt.target;

      const destinationInput = form.querySelector(`.event__input--destination`);

      if (!destinationInput.value) {
        destinationInput.setCustomValidity(`Please, select one of the destinations from the list`);
        form.reportValidity();
        return;
      } else {
        destinationInput.setCustomValidity(``);
      }

      const formData = this._eventFormComponent.getData();
      const data = parseFormData(formData, this._eventsModel, this._eventFormComponent);
      data.isFavorite = event.isFavorite;
      data.id = event.id;

      const endDateInput = form.querySelector(`#event-end-time-1`);
      const duration = getDuration(data.startDate, data.endDate).asMilliseconds();

      if (duration < 0) {
        endDateInput.setCustomValidity(`The end date cannot be earlier than the start date of the event`);
        form.reportValidity();
        return;
      } else {
        endDateInput.setCustomValidity(``);
      }

      this._eventFormComponent.setData({
        saveButtonText: `Saving...`,
      });

      this._unsetBorder();
      this._disable();

      this._mode = Mode.DEFAULT;
      this._onDataChange(this, event, data);

      document.removeEventListener(`keydown`, this._onEscKeyDown);

    });

    this._eventFormComponent.setAddToFavoritesHandler(() => {
      this._mode = Mode.UPDATE;

      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !event.isFavorite;
      this._onDataChange(this, event, newEvent);
    });

    this._eventFormComponent.setResetButtonHandler(() => {
      this._eventFormComponent.setData({
        deleteButtonText: `Deleting...`,
      });

      this._unsetBorder();
      this._disable();

      if (this._mode === Mode.CREATE) {
        this._onDataChange(this, event, EmptyEvent);
        return;
      }

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

  setMode(mode) {
    this._mode = mode;
  }

  destroy() {
    remove(this._eventItemComponent);
    remove(this._eventFormComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _switch() {
    this._eventFormComponent
      .getElement()
      .querySelectorAll(`input`, `button`)
      .forEach((control) => {
        control.disabled = !control.disabled;
      });
  }

  _disable() {
    this._eventFormComponent.getElement().style.opacity = `0.8`;
    this._switch();
  }

  _enable() {
    this._eventFormComponent.getElement().style.opacity = ``;
    this._switch();
  }

  _setDefaultButtons() {
    this._eventFormComponent.setData({
      saveButtonText: `Save`,
      deleteButtonText: `Delete`,
    });
  }

  _setBorder() {
    this._eventFormComponent.getElement().style.border = `1px solid red`;
  }

  _unsetBorder() {
    this._eventFormComponent.getElement().style.border = ``;
  }

  onError() {
    this._enable();
    this._shake();
  }

  onSuccess() {
    this._enable();
    this._setDefaultButtons();
  }

  _shake() {
    this._eventFormComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventItemComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._eventFormComponent.getElement().style.animation = ``;
      this._eventItemComponent.getElement().style.animation = ``;

      this._setDefaultButtons();
      this._setBorder();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

