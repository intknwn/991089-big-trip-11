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
  'taxi': [{name: `uber`, desc: `Order Uber`, price: 20, checked: false}],
  'bus': [{name: `meal`, desc: `Add a meal`, price: 15, checked: false}],
  'train': [{name: `comfort`, desc: `Switch to comfort`, price: 50, checked: false}, {name: `meal`, desc: `Add meal`, price: 15, checked: false}],
  'ship': [{name: `yacht`, desc: `Switch to yacht`, price: 500, checked: false}, {name: `pool`, desc: `Room with a pool`, price: 300, checked: false}],
  'transport': [{name: `helicopter`, desc: `Order a helicopter`, price: 200, checked: false}],
  'drive': [{name: `rent-car`, desc: `Rent a car`, price: 200, checked: false}],
  'flight': [{name: `luggage`, desc: `Add luggage`, price: 30, checked: false}, {name: `comfort-class`, desc: `Switch to comfort class`, price: 100, checked: false}, {name: `meal`, desc: `Add meal`, price: 15, checked: false}],
  'check-in': [{name: `breakfast`, desc: `Add breakfast`, price: 50, checked: false}],
  'sightseeing': [{name: `tickets`, desc: `Book tickets`, price: 40, checked: false}, {name: `lunch`, desc: `Lunch in city`, price: 30, checked: false}],
  'restaurant': [{name: `cake`, desc: `Order birthday cake`, price: 100, checked: false}],
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

const createDescriptions = (destArr) => {
  return destArr.reduce((acc, destination) => {
    return Object.assign(acc, {
      [destination]: {
        description: createDescriptionText(lorem),
        images: [`http://picsum.photos/248/152?r=${Math.random()}`],
      }
    });
  }, {});
};

export const descriptions = createDescriptions(destinations);

const getRandomDate = (targetDate) => {
  const newDate = new Date(`Apr 1, 2020 20:20:20`);
  const day = targetDate ? targetDate.getDate() : newDate.getDate();

  newDate.setDate(day + getRandomIntegerNumber(1, 8));
  newDate.setHours(getRandomIntegerNumber(0, 24));
  newDate.setMinutes(getRandomIntegerNumber(0, 60));

  return newDate;
};

export const createEventItem = () => {
  const id = String(new Date() + Math.random());
  const eventName = getRandomEventName(events);
  const eventType = events[eventName];
  const destination = getRandomArrayItem(destinations);
  const offersNumber = getRandomIntegerNumber(0, 5);
  const offers = createOffers(offersNumber, eventName);
  const description = descriptions[destination].description;
  const images = descriptions[destination].images;
  const startDate = getRandomDate();
  const endDate = getRandomDate(startDate);
  const price = getRandomIntegerNumber(100, 200);

  return {
    id,
    eventName,
    eventType,
    destination,
    offers,
    description,
    images,
    startDate,
    endDate,
    price,
  };
};

export const createEventItems = (number) => {
  return new Array(number)
    .fill(``)
    .map(createEventItem);
};
