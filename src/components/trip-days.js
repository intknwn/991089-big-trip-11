export const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>
    </ul>`
  );
};
