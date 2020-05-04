import {makeFirstLetterUppercase} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {SortName} from '../const.js';

const createSortControls = (sorts) => {
  return sorts.map(({name, isChecked}) => {
    const upperCaseName = makeFirstLetterUppercase(name);
    const checked = isChecked ? `checked` : ``;
    return (
      `<div class="trip-sort__item  trip-sort__item--${name}">
        <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${checked}>
        <label class="trip-sort__btn" for="sort-${name}">${upperCaseName}</label>
      </div>`
    );
  }).join(`\n`);
};

const createDayTemplate = (current) => {
  const day = current === SortName.EVENT ? `Day` : ``;
  return `<span class="trip-sort__item  trip-sort__item--day">${day}</span>`;
};

export const createSortingTemplate = (sorts, current) => {
  const sortControlsTemplate = createSortControls(sorts);
  const dayTemplate = createDayTemplate(current);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${dayTemplate}

      ${sortControlsTemplate}

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sorting extends AbstractSmartComponent {
  constructor(sorts) {
    super();
    this._sorts = sorts;
    this._currentSort = SortName.EVENT;
    this._updateSort = this._updateSort.bind(this);
    this._sortChangeHandler = null;
  }

  getTemplate() {
    return createSortingTemplate(this._sorts, this._currentSort);
  }

  setSortChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const targetValue = evt.target.value;
      const prefix = `sort-`;
      const sortValue = targetValue.substr(prefix.length);

      if (this._currentSort === sortValue) {
        return;
      }

      this._currentSort = sortValue;

      handler(this._currentSort);
      this._updateSort();
    });

    this._sortChangeHandler = handler;
  }

  _sortUpdate() {
    this._sorts.forEach((sort) => {
      sort.isChecked = sort.name === this._currentSort;
    });
  }

  _updateSort() {
    this._sortUpdate();
    super.rerender();
    this.recoveryListeners();
  }

  recoveryListeners() {
    this.setSortChangeHandler(this._sortChangeHandler);
  }
}
