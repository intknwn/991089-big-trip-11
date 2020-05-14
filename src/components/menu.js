import AbstractComponent from './abstract-component.js';

export const MenuItem = {
  TABLE: `trip-tabs__table`,
  STATS: `trip-tabs__stats`,
};

export const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" id="trip-tabs__table" href="#">Table</a>
      <a class="trip-tabs__btn" id="trip-tabs__stats" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {

  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    const allMenuItems = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    const targetMenuItem = this.getElement().querySelector(`#${menuItem}`);

    if (targetMenuItem) {
      allMenuItems.forEach((item) => {
        item.classList.remove(`trip-tabs__btn--active`);
      });

      targetMenuItem.classList.add(`trip-tabs__btn--active`);
    }
  }

  setOnChange(handler) {
    this
      .getElement()
      .querySelectorAll(`.trip-tabs__btn`)
      .forEach((menuItem) => menuItem.addEventListener(`click`, (evt) => {
        const item = evt.target.id;

        handler(item);
      }));

  }

}
