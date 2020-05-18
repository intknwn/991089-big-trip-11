import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDuration} from '../utils/common.js';

const BAR_HEIGHT = 55;

const EmojiMap = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🛳`,
  'transport': `🚊`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛`,
  'restaurant': `🍴`,
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const createChart = ({ctx, titleText, prefix = ``, postfix = ``, labels, data}) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${prefix}${val}${postfix}`
        }
      },
      title: {
        display: true,
        text: titleText,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 14,
            callback(value) {
              return `${EmojiMap[value]} ${value.toUpperCase()}`;
            }
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const parseData = (events) => {
  const parsedData = events.reduce((acc, event) => {
    const time = getDuration(event.startDate, event.endDate).asHours();

    if (!acc[event.eventName]) {
      acc[event.eventName] = {price: 0, counter: 0, time: 0};
    }
    acc[event.eventName].price += event.price;
    acc[event.eventName].counter += 1;
    acc[event.eventName].time += Math.floor(time);

    return acc;
  }, {});

  return Object.keys(parsedData).map((key) => {
    return {
      name: key,
      price: parsedData[key].price,
      counter: parsedData[key].counter,
      time: parsedData[key].time
    };
  });
};

const getDataObject = (data) => {
  return data.reduce((acc, item) => {
    acc.name.push(item.name);
    acc.price.push(item.price);
    acc.counter.push(item.counter);
    acc.time.push(item.time);
    return acc;
  }, {name: [], price: [], counter: [], time: []});
};

export default class Statistics extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();
    this._eventsModel = eventsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  renderCharts() {
    this._resetCharts();

    const events = this._eventsModel.getEvents();
    const data = parseData(events);
    const sortedByMoney = data.slice().sort((a, b) => b.price - a.price);
    const sortedByTransport = data
      .slice()
      .filter((item) => ![`check-in`, `sightseeing`, `restaurant`].includes(item.name))
      .sort((a, b) => b.counter - a.counter);
    const sortedByTimeSpent = data.slice().sort((a, b) => b.time - a.time);
    const moneyDataObject = getDataObject(sortedByMoney);
    const transportDataObject = getDataObject(sortedByTransport);
    const timeSpentDataObject = getDataObject(sortedByTimeSpent);

    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    const moneyChartConfig = {
      ctx: moneyCtx,
      titleText: `MONEY`,
      prefix: `€ `,
      labels: moneyDataObject.name,
      data: moneyDataObject.price
    };

    const transportChartConfig = {
      ctx: transportCtx,
      titleText: `TRANSPORT`,
      postfix: `x`,
      labels: transportDataObject.name,
      data: transportDataObject.counter
    };

    const timeChartConfig = {
      ctx: timeCtx,
      titleText: `TIME SPENT`,
      postfix: `H`,
      labels: timeSpentDataObject.name,
      data: timeSpentDataObject.time
    };

    moneyCtx.height = BAR_HEIGHT * sortedByMoney.length;
    transportCtx.height = BAR_HEIGHT * sortedByTransport.length;
    timeCtx.height = BAR_HEIGHT * sortedByTimeSpent.length;

    this._moneyChart = createChart(moneyChartConfig);
    this._transportChart = createChart(transportChartConfig);
    this._timeSpentChart = createChart(timeChartConfig);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpentChart) {
      this._timeSpentChart.destroy();
      this._timeSpentChart = null;
    }
  }
}
