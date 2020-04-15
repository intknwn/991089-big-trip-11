export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const getDateTime = (date, isReversed = false) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return isReversed ? `${castTimeFormat(day)}/${castTimeFormat(month)}/${year}` : `${year}-${castTimeFormat(month)}-${castTimeFormat(day)}`;
};
