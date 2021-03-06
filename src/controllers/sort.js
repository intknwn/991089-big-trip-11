import {render, replace, remove, RenderPosition} from '../utils/render.js';
import {SortName} from '../const.js';
import SortComponent from '../components/sort.js';

export default class SortController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._sortComponent = null;
    this._activeSort = SortName.EVENT;

    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    const sorts = Object.keys(SortName).map((sortName) => {
      return {
        name: SortName[sortName],
        isChecked: SortName[sortName] === this._activeSort
      };
    });

    const oldComponent = this._sortComponent;
    this._sortComponent = new SortComponent(sorts);
    this._sortComponent.setChangeHandler(this._onSortChange);

    if (oldComponent) {
      replace(this._sortComponent, oldComponent);
    } else {
      render(this._container, this._sortComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onSortChange(sortName) {
    this._activeSort = sortName;
    this._eventsModel.setSort(sortName);
  }

  setDefault() {
    this._activeSort = SortName.EVENT;
    this._eventsModel.setSort(this._activeSort);
    this.render();
  }

  destroy() {
    remove(this._sortComponent);
    this._sortComponent = null;
    this._activeSort = SortName.EVENT;
  }

  hide() {
    this._sortComponent.hide();
  }

  show() {
    if (this._sortComponent) {
      this._sortComponent.show();
    }
  }
}
