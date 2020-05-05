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
  constructor(filters) {
    super();
    this._filters = filters;
    this._currentFilter = FilterName.EVERYTHING;
    this._filterChangeHandler = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = evt.target.value;

      if (this._currentFilter === filterName) {
        return;
      }

      this._currentFilter = filterName;

      handler(this._currentFilter);
      this._updateFilters();
    });

    this._filterChangeHandler = handler;
  }


  _setChecked() {
    this._filters.forEach((filter) => {
      filter.isChecked = filter.name === this._currentFilter;
    });
  }

  _updateFilters() {
    this._setChecked();
    super.rerender();
    this.recoveryListeners();
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._filterChangeHandler);
  }
}
