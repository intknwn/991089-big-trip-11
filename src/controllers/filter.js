import {render, replace, RenderPosition} from '../utils/render.js';
import {getDisabledFilters} from '../utils/filter.js';
import {FilterName} from '../const.js';
import FilterComponent from '../components/filters.js';

export default class FiltersController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilter = FilterName.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const events = this._eventsModel.getEventsAll();
    const disabledFilters = getDisabledFilters(events);

    const filters = Object.keys(FilterName).map((filterName) => {
      const isDisabled = disabledFilters[FilterName[filterName]];

      if (isDisabled) {
        return null;
      }

      return {
        name: FilterName[filterName],
        isChecked: FilterName[filterName] === this._activeFilter,
      };
    }).filter((filter) => filter);

    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterName) {
    this._eventsModel.setFilter(filterName);
    this._activeFilter = filterName;
  }

  _onDataChange() {
    this.render();
  }

  setDefaultFilter() {
    this._activeFilter = FilterName.EVERYTHING;
    this._eventsModel.setFilter(this._activeFilter);
    this.render();
  }
}

