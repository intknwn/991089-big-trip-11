import AbstractSmartComponent from './abstract-smart-component.js';
import {FilterName} from '../const';

export const createFilterTemplate = ({name: filterName, isChecked}) => {
  const checked = isChecked ? `checked` : ``;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName}" ${checked}>
      <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
    </div>`
  );
};

export const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters.map((filter) => createFilterTemplate(filter)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractSmartComponent {
  constructor(configs) {
    super();
    this._configs = configs;
    this._current = FilterName.EVERYTHING;
    this._changeHandler = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._configs);
  }

  setChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = evt.target.value;

      if (this._current === filterName) {
        return;
      }

      this._current = filterName;

      handler(this._current);
      this._update();
    });

    this._changeHandler = handler;
  }

  _setChecked() {
    this._configs.forEach((filter) => {
      filter.isChecked = filter.name === this._current;
    });
  }

  _update() {
    this._setChecked();
    super.rerender();
    this.recoveryListeners();
  }

  recoveryListeners() {
    this.setChangeHandler(this._changeHandler);
  }
}
