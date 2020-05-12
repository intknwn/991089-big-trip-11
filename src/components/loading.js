import AbstractComponent from './abstract-component.js';

export const createLoadingMessageTemplate = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

export default class Loading extends AbstractComponent {

  getTemplate() {
    return createLoadingMessageTemplate();
  }
}
