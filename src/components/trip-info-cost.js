import AbstractComponent from './abstract-component.js';

export const createTripInfoCostTemplate = () => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
    </p>`
  );
};

export default class TripCost extends AbstractComponent {

  getTemplate() {
    return createTripInfoCostTemplate();
  }
}

