export default class Offer {
  constructor(data) {
    this.type = data[`type`];
    this.offers = data[`offers`];
  }

  static parse(data) {
    return new Offer(data);
  }

  static parseAll(data) {
    return data.map(Offer.parse);
  }
}
