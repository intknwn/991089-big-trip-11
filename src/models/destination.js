export default class Destination {
  constructor(data) {
    this.description = data[`description`];
    this.name = data[`name`];
    this.images = data[`pictures`];
  }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }
}
