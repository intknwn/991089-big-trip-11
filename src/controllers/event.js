import EventItemComponent from '../components/event-item.js';
import EventFormComponent from '../components/event-form.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {destinations} from '../mocks/event-item.js';

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  CREATE: `create`,
};

export const EmptyEvent = {
  id: String(new Date() + Math.random()),
  eventName: `ship`,
  eventType: ``,
  offers: [],
  destination: ``,
  description: ``,
  images: [],
  startDate: new Date(),
  endDate: new Date(),
  price: ``,
};

export default class EventController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
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
    this._eventFormComponent = new EventFormComponent(event, this._mode);

    this._eventItemComponent.setClickHandler(() => {
      this._replaceEventToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._eventFormComponent.getData();
      const destInput = evt.target.querySelector(`.event__input--destination`);

      if (destinations.includes(destInput.value)) {
        destInput.setCustomValidity(``);
      } else {
        destInput.setCustomValidity(`Please, select one of the destinations from the list`);
      }

      if (evt.target.checkValidity()) {
        this._onDataChange(this, event, data);
      }

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventFormComponent.setAddToFavoritesHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {isFavorite: !event.isFavorite}));
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

  destroy() {
    remove(this._eventItemComponent);
    remove(this._eventFormComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}

