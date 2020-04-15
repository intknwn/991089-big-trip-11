const eventTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-In`, `Sightseeing`, `Restaurant`];
export const destinations = [`Tokyo`, `San-Francisco`, `Los Angeles`, `New York`, `Philadelphia`, `Paris`, `Barcelona`, `Sydney`, `Amsterdam`];
const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;


const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const createOffer = (type, index) => {
  return {
    type,
    name: `Option ${index}`,
    price: getRandomIntegerNumber(0, 100),
  };
};

const createOffers = (number, type) => {
  return new Array(number)
    .fill(``)
    .map((item, i) => createOffer(type, i + 1));
};

const createDescription = (str) => str
  .split(`.`)
  .filter((it) => it)
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
