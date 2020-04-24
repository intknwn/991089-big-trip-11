/* const events = [
  {name: `taxi`, type: `move`},
  {name: `train`, type: `move`},
  {name: `ship`, type: `move`},
  {name: `transport`, type: `move`},
  {name: `drive`, type: `move`},
  {name: `flight`, type: `move`},
  {name: `check-in`, type: `stop`},
  {name: `sightseeing`, type: `stop`},
  {name: `restaurant`, type: `stop`},
];
 */

export const events = {
  'taxi': `move`,
  'bus': `move`,
  'train': `move`,
  'ship': `move`,
  'transport': `move`,
  'drive': `move`,
  'flight': `move`,
  'check-in': `stop`,
  'sightseeing': `stop`,
  'restaurant': `stop`,
};

export const destinations = [`Tokyo`, `San-Francisco`, `Los Angeles`, `New York`, `Philadelphia`, `Paris`, `Barcelona`, `Sydney`, `Amsterdam`];
export const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
export const Offers = {
  'taxi': [{name: `uber`, desc: `Order Uber`, price: 20}],
  'bus': [{name: `meal`, desc: `Add a meal`, price: 15}],
  'train': [{name: `comfort`, desc: `Switch to comfort`, price: 50}, {name: `meal`, desc: `Add meal`, price: 15}],
  'ship': [{name: `yacht`, desc: `Switch to yacht`, price: 500}, {name: `pool`, desc: `Room with a pool`, price: 300}],
  'transport': [{name: `helicopter`, desc: `Order a helicopter`, price: 200}],
  'drive': [{name: `rent-car`, desc: `Rent a car`, price: 200}],
  'flight': [{name: `luggage`, desc: `Add luggage`, price: 30}, {name: `comfort-class`, desc: `Switch to comfort class`, price: 100}, {name: `meal`, desc: `Add meal`, price: 15}],
  'check-in': [{name: `breakfast`, desc: `Add breakfast`, price: 50}],
  'sightseeing': [{name: `tickets`, desc: `Book tickets`, price: 40}, {name: `lunch`, desc: `Lunch in city`, price: 30}],
  'restaurant': [{name: `cake`, desc: `Order birthday cake`, price: 100}],
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomEventName = (eventsObject) => {
  return getRandomArrayItem(Object.keys(eventsObject));
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const createOffers = (number, eventName) => {
  return Offers[eventName]
    .slice(0, number)
    .filter((offer) => offer);
};

export const createDescriptionText = (str) => str
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
  const eventName = getRandomEventName(events);
  const eventType = events[eventName];
  const offersNumber = getRandomIntegerNumber(0, 5);
  const offers = createOffers(offersNumber, eventName);
  const description = createDescriptionText(lorem);
  const startDate = getRandomDate();
  const endDate = getRandomDate(startDate);

  return {
    eventName,
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
