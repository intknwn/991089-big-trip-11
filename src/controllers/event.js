import EventItemComponent from '../components/event-item.js';
import EventFormComponent from '../components/event-form.js';
import {render, RenderPosition, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
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

  render(event) {
    const oldEventItemComponent = this._eventItemComponent;
    const oldEventFormComponent = this._eventFormComponent;

    this._eventItemComponent = new EventItemComponent(event);
    this._eventFormComponent = new EventFormComponent(event, false);

    this._eventItemComponent.setClickHandler(() => {
      this._replaceEventToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventFormComponent.setAddToFavoritesHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {isFavorite: !event.isFavorite}));
    });

    if (oldEventItemComponent && oldEventFormComponent) {
      replace(this._eventItemComponent, oldEventItemComponent);
      replace(this._eventFormComponent, oldEventFormComponent);
    } else {
      render(this._container, this._eventItemComponent, RenderPosition.BEFOREEND);
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
}

