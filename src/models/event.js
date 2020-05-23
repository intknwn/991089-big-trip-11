export default class Event {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`type`];
    this.destination = data[`destination`][`name`];
    this.description = data[`destination`][`description`];
    this.images = data[`destination`][`pictures`];
    this.offers = data[`offers`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.isFavorite = data[`is_favorite`];
  }

  toRAW() {
    return {
      'base_price': this.price,
      'date_from': this.startDate.toISOString(),
      'date_to': this.endDate.toISOString(),
      'destination': {
        'description': this.description,
        'name': this.destination,
        'pictures': this.images,
      },
      'id': this.id,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'type': this.name,
    };
  }

  static parse(data) {
    return new Event(data);
  }

  static parseAll(data) {
    return data.map(Event.parse);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }
}
