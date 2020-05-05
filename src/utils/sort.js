import {SortName} from '../const';
import {getDuration} from '../utils/common.js';

export const sortEvents = (events, sortType) => {
  const sortedEvents = events.slice();

  switch (sortType) {

    case SortName.EVENT:
      return sortedEvents;
    case SortName.TIME:
      return sortedEvents.sort(({startDate: startDate1, endDate: endDate1}, {startDate: startDate2, endDate: endDate2}) => {
        const duration1 = getDuration(startDate1, endDate1);
        const duration2 = getDuration(startDate2, endDate2);

        return duration2.asMilliseconds() - duration1.asMilliseconds();
      });
    case SortName.PRICE:
      return sortedEvents.sort(({price: price1}, {price: price2}) => price2 - price1);
  }

  return sortedEvents;
};
