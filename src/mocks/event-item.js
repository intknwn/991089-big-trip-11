const eventTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-In`, `Sightseeing`, `Restaurant`];
export const destinations = [`Tokyo`, `San-Francisco`, `Los Angeles`, `New York`, `Philadelphia`, `Paris`, `Barcelona`, `Sydney`, `Amsterdam`];
const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const Offers = {
  'Taxi': [{name: `Order Uber`, price: 20}],
  'Bus': [{name: `Add a meal`, price: 15}],
  'Train': [{name: `Switch to comfort`, price: 50}, {name: `Add meal`, price: 15}],
  'Ship': [{name: `Switch to yacht`, price: 500}, {name: `Room with a pool`, price: 300}],
  'Transport': [{name: `Order a helicopter`, price: 200}],
  'Drive': [{name: `Rent a car`, price: 200}],
  'Flight': [{name: `Add luggage`, price: 30}, {name: `Switch to comfort class`, price: 100}, {name: `Add meal`, price: 15}],
  'Check-In': [{name: `Add breakfast`, price: 50}],
  'Sightseeing': [{name: `Book tickets`, price: 40}, {name: `Lunch in city`, price: 30}],
  'Restaurant': [{name: `Order birthday cake`, price: 100}],
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const createOffers = (number, type) => {
  return Offers[type]
    .slice(0, number)
    .filter((offer) => offer);
};

const createDescription = (str) => str
  .split(`.`)
  .filter((item) => item)
  .slice(0, getRandomIntegerNumber(1, 5))
  .join(``);

const getRandomDate = (targetDate) => {
  const newDate = new Date();
  const day = targetDate ? targetDate.getDate() : newDate.getDate();

  newDate.setDate(day + getRandomIntegerNumber(1, 8));
  newDate.setHours(getRandomIntegerNumber(0, 24));
  newDate.setMinutes(getRandomIntegerNumber(0, 60));

  return newDate;
};

export const createEventItem = () => {
  const eventType = getRandomArrayItem(eventTypes);
  const offersNumber = getRandomIntegerNumber(0, 5);
  const offers = createOffers(offersNumber, eventType);
  const description = createDescription(lorem);
  const startDate = getRandomDate();
  const endDate = getRandomDate(startDate);

  return {
    eventType,
    destination: getRandomArrayItem(destinations),
    offers,
    description,
    images: [`http://picsum.photos/248/152?r=${Math.random()}`],
    startDate,
    endDate,
    price: getRandomIntegerNumber(100, 200),
  };
};

export const createEventItems = (number) => {
  return new Array(number)
    .fill(``)
    .map(createEventItem);
};
